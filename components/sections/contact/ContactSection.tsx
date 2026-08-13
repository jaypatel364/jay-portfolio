"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { SectionHeading, ConfettiCanvas, CopyEmail } from "@/components/shared";
import { siteConfig } from "@/lib/site-config";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [confettiBurst, setConfettiBurst] = useState(0); // increment to retrigger
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypotRef.current?.value) return; // bot detected

    setState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send message.";
      setErrorMsg(message);
      setState("error");
      toast.error("Failed to send", {
        description: message,
        duration: 6000,
      });
    }
  };

  return (
    <section id="contact" className="px-6 py-14 md:py-28">
      {/* Confetti burst on successful submission */}
      <ConfettiCanvas trigger={confettiBurst > 0} key={confettiBurst} />
      <div className="mx-auto max-w-4xl">
        <SectionHeading label="Contact" title="Get In Touch" />

        <div className="mt-16 grid gap-12 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 lg:col-span-2"
          >
            <p className="text-muted-foreground">
              Have a project in mind or want to collaborate? I&apos;d love to hear from you. Drop me
              a message and I&apos;ll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <CopyEmail email={siteConfig.email} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm">{siteConfig.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5 lg:col-span-3"
          >
            {/* Honeypot */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  disabled={state === "loading"}
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={255}
                  disabled={state === "loading"}
                  className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={2000}
                disabled={state === "loading"}
                className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                placeholder="Tell me about your project..."
              />
            </div>

            {state === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400"
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
              >
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
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
        </div>
      </div>
    </section>
  );
}
