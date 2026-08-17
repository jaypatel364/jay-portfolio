import { rootMetadata, rootViewport } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import "./globals.css";

const silenceConsoleScript = `
(() => {
  const noop = function () {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  console.trace = noop;
})();
`;

// ── SEO exports ───────────────────────────────────────────────────────────────
// All metadata and viewport config lives in lib/seo.ts.
// Edit that file to change titles, descriptions, OG images, keywords, etc.
export const metadata = rootMetadata;
export const viewport = rootViewport;

// ── Root layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      {process.env.NODE_ENV === "production" ? (
        <Script id="silence-console" strategy="beforeInteractive">
          {silenceConsoleScript}
        </Script>
      ) : null}
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
