"use client";

import React, { useState } from "react";
import Link from "next/link";
import { socials } from "@/data/socials";
import { copy } from "@/data/copy";
import { SocialHoverCard } from "@/components/shared/social-hover-card";
import { Icon } from "@/components/shared/icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ContactViewProps = {
  initialTopic?: string;
  hasResendConfig?: boolean;
};

export function ContactView({ initialTopic, hasResendConfig = false }: ContactViewProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const emailItem = socials.find((s) => s.name === "Email");
  const emailAddress = emailItem?.handle || "prabhath@example.com";

  const matchedWord = initialTopic
    ? copy.cta.words.find((w) => w.topic.toLowerCase() === initialTopic.toLowerCase())
    : undefined;

  // Trim and cap at 300 chars, string value only (never HTML)
  const starterText = matchedWord ? matchedWord.starter.trim().slice(0, 300) : "";

  const emailSubject = matchedWord
    ? `[${matchedWord.topic.toUpperCase()}] Project & collaboration inquiry`
    : "Reaching out via portfolio";

  const emailHref = `mailto:${emailAddress}?subject=${encodeURIComponent(
    emailSubject
  )}${starterText ? `&body=${encodeURIComponent(starterText)}` : ""}`;

  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 pt-24 sm:pt-28 pb-20 w-full text-left">
      {/* Back link */}
      <Link
        href="/"
        data-cuelume-tap
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <Icon name="lucide:arrow-left" size={14} />
        <span>Back to overview</span>
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl font-normal text-foreground tracking-tight">
        {copy.contact.title}
      </h1>
      <p className="font-sans text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
        {copy.contact.subtitle}
      </p>

      {/* Topic Chip (shown above the form / contact card when topic is present) */}
      {matchedWord && (
        <div className="mt-6 flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/80 bg-muted/50 text-xs font-mono text-foreground select-none">
            <span className="text-muted-foreground">Topic:</span>
            <span className="font-semibold text-foreground capitalize">
              #{matchedWord.topic} ({matchedWord.word})
            </span>
            <Link
              href="/contact"
              title="Clear topic filter"
              data-cuelume-tap
              className="ml-1 text-muted-foreground hover:text-foreground text-xs leading-none transition-colors"
            >
              ✕
            </Link>
          </div>
        </div>
      )}

      {/* Main Interaction: Form (if Resend configured) OR "Send by email" card */}
      {hasResendConfig ? (
        <div className="mt-6 p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md">
          {formSubmitted ? (
            <div className="text-center py-8">
              <Icon name="lucide:check-circle" size={32} className="mx-auto text-emerald-500 mb-2" />
              <h3 className="font-display text-lg text-foreground">Message Sent</h3>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                Thanks for reaching out! I’ll get back to you soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="contact-name" className="block font-mono text-xs text-muted-foreground mb-1">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-mono text-xs text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-mono text-xs text-muted-foreground mb-1">
                  Message (max 300 chars)
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  maxLength={300}
                  defaultValue={starterText}
                  placeholder="Tell me about what you're working on..."
                  className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none font-sans"
                />
              </div>
              <button
                type="submit"
                data-cuelume-tap
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "rounded-full font-mono text-xs px-6 py-2.5 cursor-pointer"
                )}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Hidden Form Fallback: Send by email button with mailto containing encoded topic & starter text */
        <div className="mt-6 p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 pr-2">
            <span className="font-mono text-xs text-muted-foreground">Direct Email</span>
            <p className="font-mono text-sm text-foreground mt-0.5">
              {emailAddress}
            </p>
            {starterText && (
              <p className="font-mono text-xs text-muted-foreground/80 mt-2 italic bg-muted/40 p-2.5 rounded-lg border border-border/50 line-clamp-2">
                “{starterText}”
              </p>
            )}
          </div>
          <a
            href={emailHref}
            data-cuelume-tap
            className={cn(
              buttonVariants({ variant: "default" }),
              "rounded-full font-mono text-xs px-5 inline-flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
            )}
          >
            <Icon name="lucide:mail" size={14} />
            <span>Send by email</span>
          </a>
        </div>
      )}

      {/* Social links grid */}
      <div className="mt-10">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
          Connect Online
        </h2>
        <div className="flex flex-wrap gap-3.5">
          {socials.map((social) => (
            <SocialHoverCard
              key={social.name}
              social={social}
              variant="pill"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
