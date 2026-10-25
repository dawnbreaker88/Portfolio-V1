"use client";

import React from "react";
import Link from "next/link";
import { socials } from "@/data/socials";
import { copy } from "@/data/copy";
import { SocialButton } from "@/components/shared/social-button";
import { Icon } from "@/components/shared/icon";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactView() {
  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 pt-24 sm:pt-28 pb-20 w-full text-left">
      {/* Back link */}
      <Link
        href="/"
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

      {/* Direct email card */}
      <div className="mt-8 p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-muted-foreground">Direct Email</span>
          <p className="font-mono text-sm text-foreground mt-0.5">
            prabhath@example.com
          </p>
        </div>
        <a
          href="mailto:prabhath@example.com"
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-full font-mono text-xs px-5 inline-flex items-center gap-2"
          )}
        >
          <Icon name="lucide:mail" size={14} />
          <span>{copy.contact.emailLabel}</span>
        </a>
      </div>

      {/* Social links grid */}
      <div className="mt-10">
        <h2 className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-4">
          Connect Online
        </h2>
        <div className="flex flex-wrap gap-4">
          {socials.map((social) => (
            <div key={social.name} className="flex items-center gap-3">
              <SocialButton social={social} />
              <div className="text-left">
                <span className="block font-semibold text-xs text-foreground">
                  {social.name}
                </span>
                <span className="block font-mono text-[11px] text-muted-foreground">
                  {social.handle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
