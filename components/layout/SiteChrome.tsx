"use client";

import { ThemeProvider } from "@/hooks/use-theme";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalCtaGate } from "./GlobalCtaGate";
import { GlobalFloatingUI } from "./GlobalFloatingUI";
import { PageReveal } from "./PageReveal";

/** Shared chrome for inner routes that still use the homepage navbar. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PageReveal />
      <div className="site-shell relative min-h-screen w-full min-w-0 overflow-x-clip bg-background text-foreground">
        <Navbar />
        {children}
        <GlobalCtaGate />
        <Footer />
        <GlobalFloatingUI />
      </div>
    </ThemeProvider>
  );
}
