export type Project = {
  slug: string;
  title: string;
  summary: string;
  about: string;
  highlights: string[]; // 3-4 items, each <= 80 chars
  tint?: string;
  image: string;
  imageAlt: string; // /projects/<slug>.webp, 16:10
  context: string;
  details?: string[];
  solved?: string;
  whatsNew?: string;
  stack: { name: string; icon: string }[]; // icon = Iconify name
  status: "live" | "in-progress";
  category: "ml" | "agents" | "web";
  year?: string;
  featured?: boolean;
  liveUrl?: string;
  repoUrl?: string;
  draft?: boolean; // draft = noindex, excluded from sitemap/static params
};

export type SocialStat = {
  label: string;
  value: string;
};

export type SocialProfile = {
  name: string;
  handle: string;
  bio: string;
  location?: string;
  locationIcon?: string;
  avatar?: string; // local path in /public
  stats?: SocialStat[];
};

export type Social = {
  name: string;
  href: string;
  icon: string;
  handle: string;
  blurb: string;
  avatar?: string;
  profile?: SocialProfile;
};

export type Experience = {
  role: string;
  org: string;
  period: string;
  points: string[];
  url?: string;
};

export type TechItemGroup =
  | "languages"
  | "frontend"
  | "backend"
  | "databases"
  | "devops"
  | "ai";

export type TechItem = {
  name: string;
  icon: string;
  group: TechItemGroup;
};

export type Highlight = {
  label: "Research" | "Recognition" | string;
  title: string;
  text: string;
  meta?: string;
  link?: string;
};

export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

export type Identity = {
  name: string;
  title: string;
};

export type AsciiBannerVariant = "tokyo" | "kyoto" | "aurora" | "black";

export type BannerConfig =
  | {
      type: "ascii";
      variant: AsciiBannerVariant;
      alt?: string;
    }
  | {
      type: "image" | "gif";
      src: string;
      alt?: string;
      fit?: "ambient" | "cover" | "contain";
      position?: "center" | "top" | "bottom" | string;
    }
  | {
      type: "video";
      src: string;
      poster?: string;
      alt?: string;
    };

export type CtaWord = {
  word: string;
  tip: string;
  topic: string;
  starter: string;
};

export type CtaAvailability = {
  label: string;
  tip: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  taglines?: string[];
  identities: Identity[];
  url: string;
  description: string;
  bio: (string | React.ReactNode)[];
  banner: BannerConfig;
  avatar: string;
  avatars?: string[];
  githubUser?: string;
  nav: NavItem[];
};

export type GitHubContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
  level: number;
};

export type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

export type GitHubContributionData = {
  username: string;
  totalContributions: number;
  activities: Array<{
    date: string;
    count: number;
    level: number;
  }>;
  weeks: GitHubContributionWeek[];
  updatedAt: string;
};

