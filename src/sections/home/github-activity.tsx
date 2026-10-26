"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { Icon } from "@/components/shared/icon";
import {
  ContributionGraph,
  ContributionGraphCalendar,
  ContributionGraphBlock,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
  ContributionGraphLegend,
} from "@/components/provided/index";
import type { GitHubContributionData } from "@/types";

export function GithubActivitySection() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [data, setData] = useState<GitHubContributionData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadContributions = useCallback(async (isMounted = true) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/github-contributions");
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Request failed with status ${res.status}`);
      }

      if (isMounted) {
        setData(json);
        setStatus("success");
      }
    } catch (err: unknown) {
      if (isMounted) {
        const msg = err instanceof Error ? err.message : "Failed to load GitHub activity";
        setErrorMessage(msg);
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadContributions(isMounted);
    return () => {
      isMounted = false;
    };
  }, [loadContributions]);

  const profileUsername = data?.username || site.githubUser || "dawnbreaker88";

  const profileAction = (
    <Link
      href={`https://github.com/${profileUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-card/60 hover:bg-muted/80 text-xs font-mono text-muted-foreground hover:text-foreground transition-all duration-150"
    >
      <span>@{profileUsername}</span>
      <Icon name="lucide:arrow-up-right" size={13} />
    </Link>
  );

  return (
    <section id="github-activity" aria-labelledby="github-activity-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.githubActivity.title}
        index={copy.sections.githubActivity.index}
        action={profileAction}
      />

      <p className="font-mono text-xs text-muted-foreground mb-4 text-left">
        {status === "success" && data
          ? `${data.totalContributions.toLocaleString()} contributions in the last year`
          : status === "loading"
          ? "Loading live contributions from GitHub..."
          : "GitHub contribution activity"}
      </p>

      {/* Contribution Heatmap Container */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm overflow-x-auto text-left">
        {status === "loading" && (
          <div className="w-full flex flex-col gap-3 min-w-[720px] select-none py-1">
            {/* Header row skeleton */}
            <div className="flex gap-[3px] text-xs text-transparent">
              <span className="w-8">Mon</span>
            </div>
            {/* 53 weeks x 7 days grid skeleton to prevent layout shift */}
            <div className="flex gap-[3px]">
              {Array.from({ length: 53 }).map((_, col) => (
                <div key={col} className="flex flex-col gap-[3px]">
                  {Array.from({ length: 7 }).map((_, row) => (
                    <div
                      key={row}
                      className="size-[11px] rounded-[2px] bg-neutral-200/50 dark:bg-neutral-800/60 animate-pulse"
                      style={{
                        animationDelay: `${((col * 7 + row) % 20) * 45}ms`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Footer row skeleton */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <div className="h-3.5 w-40 rounded bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-neutral-200/60 dark:bg-neutral-800/60 animate-pulse" />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-3">
            <Icon name="lucide:alert-circle" size={24} className="text-muted-foreground/60" />
            <div className="space-y-1">
              <p className="font-mono text-xs text-foreground font-medium">
                {errorMessage || "Unable to load contribution data."}
              </p>
              <p className="text-xs text-muted-foreground max-w-md">
                Configure your <code className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">GITHUB_USERNAME</code> and{" "}
                <code className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">GITHUB_TOKEN</code> in{" "}
                <code className="px-1.5 py-0.5 rounded bg-muted text-[11px] font-mono">.env.local</code> to activate live heatmap sync.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => loadContributions()}
                className="px-3 py-1 text-xs font-mono rounded-full border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
              >
                Retry
              </button>
              <Link
                href={`https://github.com/${profileUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs font-mono rounded-full border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <span>View on GitHub</span>
                <Icon name="lucide:arrow-up-right" size={12} />
              </Link>
            </div>
          </div>
        )}

        {status === "success" && data && (
          <ContributionGraph
            data={data.activities}
            totalCount={data.totalContributions}
            blockSize={11}
            blockMargin={3}
            blockRadius={2}
            className="w-full text-xs font-mono"
          >
            <ContributionGraphCalendar>
              {({ activity, dayIndex, weekIndex }) => (
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                  className="transition-colors duration-150 data-[level='0']:fill-neutral-200 dark:data-[level='0']:fill-neutral-900 data-[level='1']:fill-neutral-400 dark:data-[level='1']:fill-neutral-700 data-[level='2']:fill-neutral-600 dark:data-[level='2']:fill-neutral-500 data-[level='3']:fill-neutral-800 dark:data-[level='3']:fill-neutral-300 data-[level='4']:fill-neutral-950 dark:data-[level='4']:fill-white"
                >
                  <title>{`${activity.count === 0 ? "No" : activity.count} contribution${activity.count === 1 ? "" : "s"} on ${activity.date}`}</title>
                </ContributionGraphBlock>
              )}
            </ContributionGraphCalendar>
            <ContributionGraphFooter className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              <ContributionGraphTotalCount>
                {({ totalCount }) => (
                  <span className="font-mono text-xs text-muted-foreground">
                    {totalCount.toLocaleString()} contributions in the last year
                  </span>
                )}
              </ContributionGraphTotalCount>
              <ContributionGraphLegend className="font-mono text-xs text-muted-foreground">
                {({ level }) => (
                  <svg height={11} width={11}>
                    <rect
                      className="transition-colors duration-150 data-[level='0']:fill-neutral-200 dark:data-[level='0']:fill-neutral-900 data-[level='1']:fill-neutral-400 dark:data-[level='1']:fill-neutral-700 data-[level='2']:fill-neutral-600 dark:data-[level='2']:fill-neutral-500 data-[level='3']:fill-neutral-800 dark:data-[level='3']:fill-neutral-300 data-[level='4']:fill-neutral-950 dark:data-[level='4']:fill-white"
                      data-level={level}
                      height={11}
                      width={11}
                      rx={2}
                      ry={2}
                    />
                  </svg>
                )}
              </ContributionGraphLegend>
            </ContributionGraphFooter>
          </ContributionGraph>
        )}
      </div>
    </section>
  );
}
