import { NextResponse } from "next/server";
import type {
  GitHubContributionData,
  GitHubContributionDay,
  GitHubContributionWeek,
} from "@/types";

// Note: Fetch-level caching is managed via fetch(..., { next: { revalidate: 3600 } })

interface GitHubGraphQLDay {
  date: string;
  contributionCount: number;
  contributionLevel?: string;
  color: string;
  weekday: number;
}

interface GitHubGraphQLWeek {
  contributionDays: GitHubGraphQLDay[];
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: GitHubGraphQLWeek[];
        };
      };
    };
  };
  errors?: Array<{ message: string; type?: string }>;
}

const GITHUB_GRAPHQL_QUERY = `
  query ContributionCalendar($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

function mapContributionLevel(level: string | undefined, count: number): number {
  switch (level) {
    case "FOURTH_QUARTILE":
      return 4;
    case "THIRD_QUARTILE":
      return 3;
    case "SECOND_QUARTILE":
      return 2;
    case "FIRST_QUARTILE":
      return 1;
    case "NONE":
      return 0;
    default:
      if (count >= 10) return 4;
      if (count >= 6) return 3;
      if (count >= 3) return 2;
      if (count >= 1) return 1;
      return 0;
  }
}

// In-memory deduplication for concurrent requests
let inflightRequest: Promise<GitHubContributionData> | null = null;
let inflightUsername: string | null = null;

async function fetchFromGitHub(username: string, token: string): Promise<GitHubContributionData> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "portfolio-github-contributions",
    },
    body: JSON.stringify({
      query: GITHUB_GRAPHQL_QUERY,
      variables: { username },
    }),
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("GitHub authentication failed (401). Check GITHUB_TOKEN validity.");
    }
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded or access forbidden (403).");
    }
    throw new Error(`GitHub API returned status ${res.status}`);
  }

  const json = (await res.json()) as GitHubGraphQLResponse;

  if (json.errors && json.errors.length > 0) {
    const errorMsg = json.errors.map((e) => e.message).join("; ");
    throw new Error(`GitHub GraphQL error: ${errorMsg}`);
  }

  const user = json.data?.user;
  if (!user) {
    throw new Error(`GitHub user "${username}" was not found or is inaccessible.`);
  }

  const calendar = user.contributionsCollection?.contributionCalendar;
  if (!calendar || !Array.isArray(calendar.weeks)) {
    throw new Error("Contribution calendar data is missing from the GitHub response.");
  }

  const activities: Array<{ date: string; count: number; level: number }> = [];
  const weeks: GitHubContributionWeek[] = [];

  for (const week of calendar.weeks) {
    const days: GitHubContributionDay[] = [];
    for (const day of week.contributionDays) {
      const level = mapContributionLevel(day.contributionLevel, day.contributionCount);
      activities.push({
        date: day.date,
        count: day.contributionCount,
        level,
      });
      days.push({
        date: day.date,
        contributionCount: day.contributionCount,
        color: day.color,
        weekday: day.weekday,
        level,
      });
    }
    weeks.push({ contributionDays: days });
  }

  // Ensure chronological order
  activities.sort((a, b) => a.date.localeCompare(b.date));

  return {
    username,
    totalContributions: calendar.totalContributions,
    activities,
    weeks,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const isDev = process.env.NODE_ENV !== "production";
  const username = process.env.GITHUB_USERNAME?.trim();
  const token = process.env.GITHUB_TOKEN?.trim();

  // Validate environment configuration
  if (!username || !token) {
    return NextResponse.json(
      {
        error: isDev
          ? "Missing GITHUB_USERNAME or GITHUB_TOKEN environment variable. Please set them in .env.local."
          : "GitHub contribution data service is not configured.",
        configured: false,
      },
      { status: isDev ? 500 : 503 }
    );
  }

  try {
    // Reuse inflight promise if same user is requested concurrently
    if (!inflightRequest || inflightUsername !== username) {
      inflightUsername = username;
      inflightRequest = fetchFromGitHub(username, token).finally(() => {
        inflightRequest = null;
        inflightUsername = null;
      });
    }

    const data = await inflightRequest;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Never log the token or sensitive headers
    console.error("[GitHub Contributions Route]", message);

    return NextResponse.json(
      {
        error: isDev ? message : "Failed to retrieve GitHub contribution data.",
        configured: true,
      },
      { status: 502 }
    );
  }
}
