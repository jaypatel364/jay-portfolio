import { rootMetadata, rootViewport } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
