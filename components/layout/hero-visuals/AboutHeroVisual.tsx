import { siteConfig } from "@/lib/site-config";
import { getExperienceLabel } from "@/lib/utils";
import { HeroVisualFrame } from "./HeroVisualFrame";

type CodeLine =
  | { kind: "decl"; prefix: string; key: string; punct: string }
  | { kind: "field"; key: string; value: string }
  | { kind: "end"; punct: string };

const TYPED_LINES: CodeLine[] = [
  { kind: "decl", prefix: "const", key: "developer", punct: " = {" },
  { kind: "field", key: "name", value: `"${siteConfig.fullName}"` },
  { kind: "field", key: "role", value: '"Full Stack Developer"' },
  { kind: "field", key: "stack", value: '["React", "Next.js", "Node"]' },
  { kind: "field", key: "location", value: `"${siteConfig.location}"` },
  { kind: "field", key: "projects", value: '"real products"' },
  { kind: "end", punct: "};" },
];

function lineText(line: CodeLine) {
  if (line.kind === "decl") return `${line.prefix} ${line.key}${line.punct}`;
  if (line.kind === "field") return `  ${line.key}: ${line.value},`;
  return line.punct;
}

const FULL_SOURCE = TYPED_LINES.map(lineText).join("\n");

/** About hero — static code snapshot (SSR-friendly, no entrance animation). */
export function AboutHeroVisual() {
  const expLabel = getExperienceLabel(siteConfig.careerStartDate);

  return (
    <HeroVisualFrame
      label={`Code snapshot: ${siteConfig.fullName}, full stack developer in ${siteConfig.location}`}
    >
      <div className="flex h-full min-h-[280px] flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2 border-b border-border/70 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">about.ts</span>
        </div>

        <pre className="mt-4 flex-1 overflow-x-auto font-mono text-[11px] leading-6 sm:text-[13px]">
          {FULL_SOURCE.split("\n").map((row, i) => (
            <div key={i} className="whitespace-pre-wrap break-all sm:whitespace-pre">
              {colorize(row)}
            </div>
          ))}
        </pre>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { value: `${expLabel}y`, label: "Experience" },
            { value: siteConfig.location, label: "Based" },
            { value: "Open", label: "Hiring" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/70 bg-background/65 px-2 py-2 text-center backdrop-blur-sm"
            >
              <p className="font-heading text-sm font-bold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </HeroVisualFrame>
  );
}

function colorize(row: string) {
  if (!row) return "\u00a0";
  if (row.startsWith("const ")) {
    return (
      <>
        <span className="text-primary">const</span>
        <span className="text-foreground"> developer</span>
        <span className="text-muted-foreground"> = {"{"}</span>
      </>
    );
  }
  if (row.trim() === "};") {
    return <span className="text-muted-foreground">{row}</span>;
  }
  const match = row.match(/^(\s+)(\w+): (.+),$/);
  if (match) {
    return (
      <>
        {match[1]}
        <span className="text-[var(--glow)]">{match[2]}</span>
        <span className="text-muted-foreground">: </span>
        <span className="text-primary">{match[3]}</span>
        <span className="text-muted-foreground">,</span>
      </>
    );
  }
  return <span className="text-foreground">{row}</span>;
}
