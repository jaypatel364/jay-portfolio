import { HeroWeb } from "./HeroWeb";

/**
 * Hero backdrop — a floating spider web over film grain.
 * No colour washes: depth comes from line work and texture.
 */
export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <HeroWeb />
      <div className="absolute inset-0 hero-grain" />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
