"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  Copy,
  MapPin,
  MessageSquare,
  Phone,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { innerPages } from "@/settings/pages";
import { cn } from "@/lib/utils";

type Intent = (typeof siteConfig.globalCta.intents)[number];

const INTENT_ICONS: Record<string, LucideIcon> = {
  collab: Briefcase,
  freelance: Rocket,
  call: Phone,
};

function resolveHref(intent: Intent): string {
  if (intent.primaryHref === "booking") return siteConfig.bookingUrl;
  return intent.primaryHref;
}

function CommandLine({ command }: { command: string }) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplay("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplay(command.slice(0, i));
      if (i >= command.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [command]);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border/80 bg-background/60 font-mono text-[11px] backdrop-blur-sm sm:text-xs">
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2 text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-amber-400/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        <span className="ml-1 truncate">~/hire-jay</span>
      </div>
      <p className="px-3 py-3 text-foreground/90">
        <span className="text-primary">$</span> {display}
        <motion.span
          animate={{ opacity: done ? [1, 0, 1] : 1 }}
          transition={{ duration: 0.8, repeat: done ? Infinity : 0 }}
          className="ml-0.5 inline-block h-[1em] w-2 translate-y-[2px] bg-primary"
        />
      </p>
    </div>
  );
}

function ActionTile({
  icon: Icon,
  label,
  hint,
  onClick,
  href,
  external,
}: {
  icon: typeof Calendar;
  label: string;
  hint: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
    </>
  );

  const className = cn(
    "group flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/50 p-3.5 text-left transition-all duration-300",
    "hover:border-primary/30 hover:bg-background hover:shadow-glow",
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export function GlobalCta() {
  const { globalCta } = siteConfig;
  const [activeId, setActiveId] = useState(globalCta.intents[1]?.id ?? globalCta.intents[0].id);
  const [emailCopied, setEmailCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 22 });
  const glowX = useTransform(springX, [-0.5, 0.5], ["25%", "75%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["15%", "85%"]);

  const active = globalCta.intents.find((i) => i.id === activeId) ?? globalCta.intents[0];
  const contactHref = `${innerPages.contact.path}/`;
  const primaryHref = resolveHref(active);
  const primaryExternal = active.primaryHref === "booking";

  useEffect(() => {
    const scrollToContact = () => {
      if (window.location.hash !== "#contact") return;
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };
    const t = window.setTimeout(scrollToContact, 80);
    window.addEventListener("hashchange", scrollToContact);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", scrollToContact);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setEmailCopied(true);
      toast.success("Email copied", { description: siteConfig.email });
      window.setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      toast.error("Could not copy", { description: "Please copy the address manually." });
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="global-cta-heading"
      className="relative scroll-mt-24 px-4 pb-4 pt-16 sm:px-6 md:pb-6 md:pt-24"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <motion.div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-premium"
        >
          <div className="absolute inset-0 bg-grid opacity-30" />
          <motion.div
            style={{ left: glowX, top: glowY }}
            className="pointer-events-none absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
          />
          <div
            className="aurora-blob absolute -left-16 top-0 h-48 w-48 bg-primary"
            style={{ animation: "aurora-1 14s ease-in-out infinite" }}
          />
          <div
            className="aurora-blob absolute -bottom-12 right-0 h-40 w-40 bg-glow"
            style={{ animation: "aurora-2 16s ease-in-out infinite" }}
          />

          <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-12">
            {/* Left — narrative + terminal */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  {globalCta.availability}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 text-primary" />
                  {siteConfig.location}
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-primary">
                {globalCta.label}
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2
                    id="global-cta-heading"
                    className="font-heading mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl"
                  >
                    {active.headlineBefore}{" "}
                    <span className="gradient-text-animated">{active.highlight}</span>
                    {active.headlineAfter ? ` ${active.headlineAfter}` : ""}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`cmd-${active.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommandLine command={active.command} />
                </motion.div>
              </AnimatePresence>

              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {globalCta.responseTime}
              </p>
            </div>

            {/* Right — intent picker + actions */}
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What brings you here?
              </p>
              <div
                className="mt-3 flex flex-wrap gap-2"
                role="tablist"
                aria-label="Choose your intent"
              >
                {globalCta.intents.map((intent) => {
                  const selected = intent.id === activeId;
                  return (
                    <button
                      key={intent.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveId(intent.id)}
                      className={cn(
                        "relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                        selected
                          ? "border-primary/40 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground",
                      )}
                    >
                      {selected && (
                        <motion.div
                          layoutId="global-cta-intent"
                          className="absolute inset-0 rounded-full bg-primary/10"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {(() => {
                          const Icon = INTENT_ICONS[intent.id] ?? Briefcase;
                          return <Icon className="h-3.5 w-3.5" aria-hidden />;
                        })()}
                        {intent.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* <AnimatePresence mode="wait">
                <motion.div
                  key={`cta-${active.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <a
                    href={primaryHref}
                    target={primaryExternal ? "_blank" : undefined}
                    rel={primaryExternal ? "noopener noreferrer" : undefined}
                    className="btn-shine group inline-flex w-full items-center justify-center gap-2 rounded-full gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {active.primaryCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </motion.div>
              </AnimatePresence> */}

              <div className="mt-4 grid gap-2 sm:grid-cols-1">
                <ActionTile
                  icon={Calendar}
                  label={globalCta.actions.book.label}
                  hint={globalCta.actions.book.hint}
                  href={siteConfig.bookingUrl}
                  external
                />
                <ActionTile
                  icon={emailCopied ? Check : Copy}
                  label={emailCopied ? "Copied!" : globalCta.actions.email.label}
                  hint={siteConfig.email}
                  onClick={handleCopyEmail}
                />
                <ActionTile
                  icon={MessageSquare}
                  label={globalCta.actions.message.label}
                  hint={globalCta.actions.message.hint}
                  href={contactHref}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
