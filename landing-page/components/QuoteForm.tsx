"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

const projectTypes = ["Wrecking", "Salvage", "Anti-Gravity Lifting"];

type Status = "idle" | "submitting" | "submitted";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    window.setTimeout(() => setStatus("submitted"), 900);
  }

  if (status === "submitted") {
    return (
      <div className="panel-glass flex flex-col items-center gap-4 rounded-2xl px-8 py-16 text-center">
        <CheckCircle2 size={44} className="text-orange" />
        <h3 className="font-display text-xl font-700 uppercase tracking-wide text-foreground">
          Request Received
        </h3>
        <p className="max-w-sm text-sm text-muted">
          Our team will review your project details and follow up shortly
          with a precision salvage plan.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel-glass rounded-2xl p-8 sm:p-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jordan Reyes"
            className="mt-2 w-full rounded-md border border-line bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-orange"
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="mt-2 w-full rounded-md border border-line bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-orange"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="projectType" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            className="mt-2 w-full rounded-md border border-line bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-orange"
          >
            <option value="" disabled>
              Select a service
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-muted">
            Project Details
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="Tell us about the site, structure size, timeline, and any constraints..."
            className="mt-2 w-full resize-none rounded-md border border-line bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-orange"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-orange px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(255,90,31,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-orange-dark disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Submit Request
            <Send size={16} />
          </>
        )}
      </button>
    </form>
  );
}
