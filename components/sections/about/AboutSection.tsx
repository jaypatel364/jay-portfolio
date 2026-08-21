import { getGitHubContributions } from "@/lib/github-contributions";
import { AboutSectionClient } from "./AboutSectionClient";

/** Server wrapper — prefetches GitHub contributions (ISR) for SEO + faster paint. */
export async function AboutSection({ showPageCta = true }: { showPageCta?: boolean } = {}) {
  const initialContributions = await getGitHubContributions();
  return (
    <AboutSectionClient initialContributions={initialContributions} showPageCta={showPageCta} />
  );
}
