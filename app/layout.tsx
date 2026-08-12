import { rootMetadata, rootViewport } from "@/lib/seo";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
