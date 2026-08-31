import Link from "next/link";
import { cn } from "@/lib/utils";

type SiteButtonVariant = "primary" | "secondary";
type SiteButtonSize = "default" | "sm";

const variantClasses: Record<SiteButtonVariant, string> = {
  primary:
    "btn-shine group inline-flex items-center justify-center gap-2 rounded-full gradient-primary font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card font-semibold text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
};

const sizeClasses: Record<SiteButtonSize, string> = {
  default: "px-6 py-3.5 text-sm",
  sm: "px-4 py-2.5 text-sm",
};

interface SiteButtonCommonProps {
  variant?: SiteButtonVariant;
  size?: SiteButtonSize;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

type SiteButtonProps = SiteButtonCommonProps &
  (
    | {
        href: string;
        external?: boolean;
        onClick?: never;
        type?: never;
      }
    | {
        href?: never;
        external?: never;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        type?: "button" | "submit";
      }
  );

/** Portfolio primary / secondary button — link, external link, or native button. */
export function SiteButton({
  variant = "primary",
  size = "default",
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: SiteButtonProps) {
  const classes = cn(variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={props.href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
