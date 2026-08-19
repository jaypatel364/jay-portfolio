"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { isLocalHostname, isRecaptchaProductionRuntime } from "@/lib/recaptcha-runtime";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

type Grecaptcha = {
  ready: (cb: () => void) => void;
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark";
      size?: "normal" | "compact";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let recaptchaScriptPromise: Promise<Grecaptcha> | null = null;

function loadGrecaptcha(): Promise<Grecaptcha> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is browser-only"));
  }
  if (window.grecaptcha?.ready) {
    return new Promise((resolve) => {
      window.grecaptcha!.ready(() => resolve(window.grecaptcha!));
    });
  }
  if (recaptchaScriptPromise) return recaptchaScriptPromise;

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://www.google.com/recaptcha/api.js"]',
    );

    const onReady = () => {
      const api = window.grecaptcha;
      if (!api?.ready) {
        reject(new Error("reCAPTCHA failed to initialize"));
        return;
      }
      api.ready(() => resolve(api));
    };

    if (existing) {
      if (window.grecaptcha?.ready) {
        onReady();
        return;
      }
      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load reCAPTCHA")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = onReady;
    script.onerror = () => {
      recaptchaScriptPromise = null;
      reject(new Error("Failed to load reCAPTCHA"));
    };
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

export function isRecaptchaEnabled(): boolean {
  if (!SITE_KEY || !isRecaptchaProductionRuntime()) return false;
  if (typeof window !== "undefined" && isLocalHostname(window.location.hostname)) return false;
  return true;
}

interface RecaptchaCheckboxProps {
  onTokenChange: (token: string | null) => void;
  resetSignal?: number;
  disabled?: boolean;
}

export function RecaptchaCheckbox({
  onTokenChange,
  resetSignal = 0,
  disabled = false,
}: RecaptchaCheckboxProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const instanceId = useId();
  const [active, setActive] = useState(false);

  onTokenChangeRef.current = onTokenChange;

  useEffect(() => {
    setActive(isRecaptchaEnabled());
  }, []);

  useEffect(() => {
    if (!active) return;
    if (!containerRef.current) return;

    let cancelled = false;

    loadGrecaptcha()
      .then((api) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";
        widgetIdRef.current = api.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: resolvedTheme,
          size: "normal",
          callback: (token) => onTokenChangeRef.current(token),
          "expired-callback": () => onTokenChangeRef.current(null),
          "error-callback": () => onTokenChangeRef.current(null),
        });
      })
      .catch(() => {
        if (!cancelled) onTokenChangeRef.current(null);
      });

    return () => {
      cancelled = true;
      widgetIdRef.current = null;
      onTokenChangeRef.current(null);
    };
  }, [active, resolvedTheme]);

  useEffect(() => {
    if (!resetSignal || widgetIdRef.current === null || !window.grecaptcha) return;
    window.grecaptcha.reset(widgetIdRef.current);
    onTokenChangeRef.current(null);
  }, [resetSignal]);

  if (!active) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium" id={`${instanceId}-label`}>
        Verification
      </p>
      <div className="overflow-x-auto">
        <div
          ref={containerRef}
          className={disabled ? "pointer-events-none opacity-60" : undefined}
          aria-labelledby={`${instanceId}-label`}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Check the box to confirm you&apos;re not a robot.
      </p>
    </div>
  );
}
