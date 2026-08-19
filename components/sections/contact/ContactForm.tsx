"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ConfettiCanvas } from "@/components/shared";
import { cn } from "@/lib/utils";
import { RecaptchaCheckbox, isRecaptchaEnabled } from "./RecaptchaCheckbox";

type FormState = "idle" | "loading" | "success" | "error";

interface ContactFormProps {
  className?: string;
  idPrefix?: string;
  showHeader?: boolean;
}

const inputClassName =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50";

export function ContactForm({
  className,
  idPrefix = "contact",
  showHeader = false,
}: ContactFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confettiBurst, setConfettiBurst] = useState(0);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [recaptchaReset, setRecaptchaReset] = useState(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [recaptchaRequired, setRecaptchaRequired] = useState(false);

  useEffect(() => {
    setRecaptchaRequired(isRecaptchaEnabled());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypotRef.current?.value) return;

    if (recaptchaRequired && !recaptchaToken) {
      const message = "Please check the verification box before sending.";
      setErrorMsg(message);
      setState("error");
      toast.error("Verification required", { description: message, duration: 5000 });
      return;
    }

    setState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      recaptchaToken: recaptchaToken || undefined,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setState("success");
      setConfettiBurst((n) => n + 1);
      toast.success("Message sent!", {
        description: "Thanks for reaching out — I'll get back to you soon.",
        duration: 5000,
      });
      form.reset();
      setRecaptchaToken(null);
      setRecaptchaReset((n) => n + 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send message.";
      setErrorMsg(message);
      setState("error");
      setRecaptchaToken(null);
      setRecaptchaReset((n) => n + 1);
      toast.error("Failed to send", { description: message, duration: 6000 });
    }
  };

  return (
    <>
      <ConfettiCanvas trigger={confettiBurst > 0} key={confettiBurst} />
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className={cn("space-y-5", className)}
        aria-label="Contact form"
      >
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute h-0 w-0 opacity-0"
          aria-hidden="true"
        />

        {showHeader ? (
          <div className="sr-only">
            <h2>Send a message</h2>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idPrefix}-firstName`} className="mb-1.5 block text-sm font-medium">
              First name
            </label>
            <input
              id={`${idPrefix}-firstName`}
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              maxLength={50}
              disabled={state === "loading"}
              className={inputClassName}
              placeholder="Jay"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-lastName`} className="mb-1.5 block text-sm font-medium">
              Last name
            </label>
            <input
              id={`${idPrefix}-lastName`}
              name="lastName"
              type="text"
              required
              autoComplete="family-name"
              maxLength={50}
              disabled={state === "loading"}
              className={inputClassName}
              placeholder="Patel"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${idPrefix}-phone`} className="mb-1.5 block text-sm font-medium">
              Phone number
            </label>
            <input
              id={`${idPrefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              disabled={state === "loading"}
              className={inputClassName}
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-email`} className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={255}
              disabled={state === "loading"}
              className={inputClassName}
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-message`} className="mb-1.5 block text-sm font-medium">
            Message
          </label>
          <textarea
            id={`${idPrefix}-message`}
            name="message"
            required
            rows={5}
            maxLength={2000}
            disabled={state === "loading"}
            className={cn(inputClassName, "resize-none")}
            placeholder="Tell me about your project, role, or timeline..."
          />
        </div>

        <RecaptchaCheckbox
          onTokenChange={setRecaptchaToken}
          resetSignal={recaptchaReset}
          disabled={state === "loading"}
        />

        {state === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
            role="status"
          >
            <CheckCircle className="h-4 w-4" />
            Message sent successfully! I&apos;ll get back to you soon.
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={state === "loading" || (recaptchaRequired && !recaptchaToken)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </button>
      </motion.form>
    </>
  );
}
