"use client";

import { motion } from "framer-motion";
import { Layers, Server, Gauge, Monitor, Rocket, LayoutGrid } from "lucide-react";
import { HeroVisualFrame } from "./HeroVisualFrame";

/** Decorative hero for /services/ hub — layered product/service motif. */
export function ServicesHeroVisual() {
  return (
    <HeroVisualFrame label="Software development services">
      <div className="relative flex h-full min-h-[220px] items-center justify-center p-6">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[12%] top-[18%] rounded-xl border border-primary/25 bg-primary/10 p-3"
        >
          <LayoutGrid className="h-6 w-6 text-primary" aria-hidden />
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute right-[10%] top-[22%] rounded-xl border border-border bg-card p-3"
        >
          <Server className="h-6 w-6 text-muted-foreground" aria-hidden />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-card p-8 shadow-glow"
        >
          <Layers className="mx-auto h-10 w-10 text-primary" aria-hidden />
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
            6 service modules
          </p>
        </motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[20%] rounded-xl border border-border bg-card p-3"
        >
          <Rocket className="h-5 w-5 text-primary" aria-hidden />
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-[18%] right-[18%] rounded-xl border border-border bg-card p-3"
        >
          <Gauge className="h-5 w-5 text-muted-foreground" aria-hidden />
        </motion.div>
        <Monitor
          className="absolute bottom-[8%] left-1/2 h-5 w-5 -translate-x-1/2 text-primary/40"
          aria-hidden
        />
      </div>
    </HeroVisualFrame>
  );
}
