import { siteConfig } from "@/settings";
import { contributionYearQuery } from "@/lib/github-years";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/** Server-side fetch with ISR — revalidate every hour. */
export async function getGitHubContributions(): Promise<ContributionDay[]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${siteConfig.githubUsername}?${contributionYearQuery()}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      contributions?: { date: string; count: number; level: number }[];
    };
    return (json.contributions ?? []).map((d) => ({
      date: d.date,
      count: d.count,
      level: Math.min(4, d.level) as ContributionDay["level"],
    }));
  } catch {
    return [];
  }
}
