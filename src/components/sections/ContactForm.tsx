"use client";

import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm text-fg placeholder:text-muted-2 transition-colors focus:border-accent/60 focus:bg-white/[0.04] focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="glass flex h-full min-h-72 flex-col items-center justify-center rounded-2xl p-8 text-center" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
          <Send className="size-5" />
        </span>
        <p className="mt-4 text-lg font-semibold text-fg">Message sent.</p>
        <p className="mt-1 text-sm text-muted">Thanks for reaching out. I&apos;ll reply by email.</p>
        <Button variant="ghost" size="sm" className="mt-6" onClick={() => setStatus("idle")}>
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-7" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Name</span>
          <input name="name" type="text" required minLength={2} maxLength={80} autoComplete="name" spellCheck={false} className={field} placeholder="Your name…" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted">Email</span>
          <input
            name="email"
            type="email"
            inputMode="email"
            required
            maxLength={120}
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            className={field}
            placeholder="you@company.com…"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-medium text-muted">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          className={cn(field, "resize-y")}
          placeholder="What are you working on, and how can I help…"
        />
      </label>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label>
          Company <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-2">Delivered straight to my inbox. No newsletter, no tracking.</p>
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {status === "sending" ? "Sending…" : "Send Message"}
        </Button>
      </div>
      <div aria-live="polite">
        {status === "error" && (
          <p role="alert" className="mt-3 text-sm text-rose-300">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
