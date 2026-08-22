import { cookies } from "next/headers";
import { rootMetadata, rootViewport } from "@/lib/seo";
import { features } from "@/settings/features";
import {
  ACCENT_BOOT_CSS,
  BOOT_COVER_CSS,
  getServerAccentId,
  getThemeBootScript,
  PAGE_REVEAL_CSS,
} from "@/lib/theme-boot";
import { ACCENT_STORAGE_KEY } from "@/lib/accent-colors";
import { fontVariables, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { AccentBoot } from "@/components/layout/AccentBoot";
import { AccentProvider } from "@/hooks/use-accent";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accentId = getServerAccentId(cookieStore.get(ACCENT_STORAGE_KEY)?.value);

  return (
    <html
      lang="en"
      data-accent={accentId}
      className={cn("bg-background", fontVariables)}
      suppressHydrationWarning
    >
      <head>
        <style id="accent-boot" dangerouslySetInnerHTML={{ __html: ACCENT_BOOT_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: getThemeBootScript() }} />
        <style dangerouslySetInnerHTML={{ __html: PAGE_REVEAL_CSS }} />
        {features.showLoadingScreen ? (
          <style dangerouslySetInnerHTML={{ __html: BOOT_COVER_CSS }} />
        ) : null}
        <noscript>
          <style>{`html[data-page-pending="true"] .site-shell { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body className={cn("antialiased", inter.className)}>
        <AccentProvider initialAccentId={accentId}>
          <AccentBoot />
          {features.showLoadingScreen ? (
            <div id="site-boot-cover" className="site-boot-cover" aria-hidden="true" />
          ) : null}
          {children}
          <Toaster position="bottom-right" richColors closeButton />
          <Analytics />
          <SpeedInsights />
        </AccentProvider>
      </body>
    </html>
  );
}
