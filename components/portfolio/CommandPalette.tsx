"use client";

import { useState, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Home,
  User,
  Wrench,
  Briefcase,
  GraduationCap,
  Mail,
  Download,
  Sun,
  Moon,
  CalendarDays,
  Keyboard,
  FileText,
  FolderKanban,
} from "lucide-react";
import { ACCENT_PRESETS, ACCENT_STORAGE_KEY } from "@/lib/accent-colors";
import { siteConfig } from "@/lib/site-config";
import { useTheme } from "@/hooks/use-theme";

// Brand icons not available in this version of lucide-react
const GithubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "contact", label: "Contact", icon: Mail },
];

interface CommandPaletteProps {
  /** Controlled open state — parent (Navbar) can also open it */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Callback to open the shortcuts overlay from within the palette */
  onOpenShortcuts?: () => void;
}

export function CommandPalette({
  open: controlledOpen,
  onOpenChange,
  onOpenShortcuts,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  // Support both controlled (from Navbar button) and uncontrolled (keyboard shortcut)
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = useCallback(
    (val: boolean) => {
      setInternalOpen(val);
      onOpenChange?.(val);
    },
    [onOpenChange],
  );

  // ⌘K / Ctrl+K is handled by Navbar's global listener to coordinate
  // with the shortcuts overlay. No listener needed here.

  const scrollTo = (id: string) => {
    setOpen(false);
    // Small delay so the dialog closes before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const handleThemeToggle = () => {
    setOpen(false);
    toggleTheme();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Search sections, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigate">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <CommandItem
              key={id}
              value={label}
              onSelect={() => scrollTo(id)}
              className="gap-3 cursor-pointer"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span>{label}</span>
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            value="Download CV Resume"
            onSelect={() => {
              setOpen(false);
              window.open(siteConfig.resumeUrl, "_blank");
            }}
            className="gap-3 cursor-pointer"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span>Download CV</span>
          </CommandItem>

          <CommandItem
            value="View Resume Print PDF"
            onSelect={() => {
              setOpen(false);
              window.open("/resume", "_blank");
            }}
            className="gap-3 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>View Resume</span>
          </CommandItem>

          <CommandItem
            value="Book a Meeting Schedule Call Calendly"
            onSelect={() => {
              setOpen(false);
              window.open(siteConfig.bookingUrl, "_blank");
            }}
            className="gap-3 cursor-pointer"
          >
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span>Book a Meeting</span>
          </CommandItem>

          <CommandItem
            value="Send Email Contact"
            onSelect={() => {
              setOpen(false);
              window.location.href = `mailto:${siteConfig.email}`;
            }}
            className="gap-3 cursor-pointer"
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>Send an Email</span>
          </CommandItem>

          <CommandItem
            value="Toggle Theme Dark Light Mode"
            onSelect={handleThemeToggle}
            className="gap-3 cursor-pointer"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
            <span>Toggle {resolvedTheme === "dark" ? "Light" : "Dark"} Mode</span>
          </CommandItem>

          {onOpenShortcuts && (
            <CommandItem
              value="Keyboard Shortcuts Help Hotkeys"
              onSelect={() => {
                setOpen(false);
                onOpenShortcuts();
              }}
              className="gap-3 cursor-pointer"
            >
              <Keyboard className="h-4 w-4 text-muted-foreground" />
              <span>Show Keyboard Shortcuts</span>
              <CommandShortcut>?</CommandShortcut>
            </CommandItem>
          )}
        </CommandGroup>

        <CommandSeparator />

        {/* Accent colors */}
        <CommandGroup heading="Accent Color">
          {ACCENT_PRESETS.map((preset) => (
            <CommandItem
              key={preset.id}
              value={`Accent color ${preset.label}`}
              onSelect={() => {
                setOpen(false);
                localStorage.setItem(ACCENT_STORAGE_KEY, preset.id);
                window.dispatchEvent(
                  new StorageEvent("storage", {
                    key: ACCENT_STORAGE_KEY,
                    newValue: preset.id,
                  }),
                );
              }}
              className="gap-3 cursor-pointer"
            >
              <span
                className="h-4 w-4 shrink-0 rounded-full ring-1 ring-border"
                style={{ background: preset.swatch }}
              />
              <span>{preset.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Social Links */}
        <CommandGroup heading="Social">
          <CommandItem
            value="GitHub Profile"
            onSelect={() => {
              setOpen(false);
              window.open(siteConfig.github, "_blank");
            }}
            className="gap-3 cursor-pointer"
          >
            <span className="text-muted-foreground">
              <GithubIcon />
            </span>
            <span>GitHub</span>
          </CommandItem>

          <CommandItem
            value="LinkedIn Profile"
            onSelect={() => {
              setOpen(false);
              window.open(siteConfig.linkedin, "_blank");
            }}
            className="gap-3 cursor-pointer"
          >
            <span className="text-muted-foreground">
              <LinkedinIcon />
            </span>
            <span>LinkedIn</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
