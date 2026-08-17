"use client";

import { ThemeProvider } from "@/hooks/use-theme";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageReveal } from "./PageReveal";

/** Shared chrome for inner routes that still use the homepage navbar. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PageReveal />
      <div className="site-shell relative min-h-screen bg-background text-foreground">
        <Navbar />
        {children}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
