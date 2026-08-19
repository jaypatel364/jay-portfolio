import { rootMetadata, rootViewport } from "@/lib/seo";
import { features } from "@/settings/features";
import { getThemeBootScript, BOOT_COVER_CSS, PAGE_REVEAL_CSS } from "@/lib/theme-boot";
import { fontVariables, inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("bg-background", fontVariables)} suppressHydrationWarning>
      <head>
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
        {features.showLoadingScreen ? (
          <div id="site-boot-cover" className="site-boot-cover" aria-hidden="true" />
        ) : null}
        {children}
        <Toaster position="bottom-right" richColors closeButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
