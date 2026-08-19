import { getGitHubContributions } from "@/lib/github-contributions";
import { AboutSectionClient } from "./AboutSectionClient";

/** Server wrapper — prefetches GitHub contributions (ISR) for SEO + faster paint. */
export async function AboutSection({
  showPageCta = true,
  heading,
  variant = "home",
}: {
  showPageCta?: boolean;
  heading?: { label: string; title: string };
  variant?: "home" | "page";
} = {}) {
  const initialContributions = await getGitHubContributions();
  return (
    <AboutSectionClient
      initialContributions={initialContributions}
      showPageCta={showPageCta}
      heading={heading}
      variant={variant}
    />
  );
}
