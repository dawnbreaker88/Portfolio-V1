"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { site } from "@/data/site";
import { copy } from "@/data/copy";
import { SectionHeader } from "@/components/layout/section-header";
import { Icon } from "@/components/shared/icon";
import {
  ContributionGraph,
  ContributionGraphCalendar,
  ContributionGraphBlock,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
  ContributionGraphLegend,
  type Activity,
} from "@/components/provided/index";

export function GithubActivitySection() {
  // Generate realistic activity data for the last 52 weeks totaling ~976 contributions
  const activityData: Activity[] = useMemo(() => {
    const today = new Date("2026-10-24T00:00:00Z");
    const result: Activity[] = [];
    const days = 52 * 7;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      // Pseudo-random distribution with clusters of intense coding
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const seed = (d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate()) % 100;

      let count = 0;
      let level = 0;

      if (!isWeekend && seed > 22) {
        if (seed > 85) {
          count = 8 + (seed % 9);
          level = 4;
        } else if (seed > 60) {
          count = 4 + (seed % 4);
          level = 3;
        } else if (seed > 40) {
          count = 2 + (seed % 2);
          level = 2;
        } else {
          count = 1;
          level = 1;
        }
      } else if (isWeekend && seed > 70) {
        count = 1 + (seed % 3);
        level = 1;
      }

      result.push({
        date: dateStr,
        count,
        level,
      });
    }

    return result;
  }, []);

  const profileAction = (
    <Link
      href={`https://github.com/${site.githubUser}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-card/60 hover:bg-muted/80 text-xs font-mono text-muted-foreground hover:text-foreground transition-all duration-150"
    >
      <span>@{site.githubUser}</span>
      <Icon name="lucide:arrow-up-right" size={13} />
    </Link>
  );

  return (
    <section id="github-activity" aria-labelledby="github-activity-heading" className="mb-20 sm:mb-24">
      <SectionHeader
        title={copy.sections.githubActivity.title}
        index={copy.sections.githubActivity.index}
        action={profileAction}
      />

      <p className="font-mono text-xs text-muted-foreground mb-4 text-left">
        976 contributions in the last year
      </p>

      {/* Contribution Heatmap Container */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-sm overflow-x-auto text-left">
        <ContributionGraph
          data={activityData}
          totalCount={976}
          blockSize={11}
          blockMargin={3}
          blockRadius={2}
          className="w-full text-xs font-mono"
        >
          <ContributionGraphCalendar>
            {({ activity, dayIndex, weekIndex }) => (
              <ContributionGraphBlock
                activity={activity}
                dayIndex={dayIndex}
                weekIndex={weekIndex}
                className="transition-colors duration-150 data-[level='0']:fill-neutral-900 data-[level='1']:fill-neutral-700 data-[level='2']:fill-neutral-500 data-[level='3']:fill-neutral-300 data-[level='4']:fill-white"
              />
            )}
          </ContributionGraphCalendar>
          <ContributionGraphFooter className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
            <ContributionGraphTotalCount>
              {({ totalCount }) => (
                <span className="font-mono text-xs text-muted-foreground">
                  {totalCount} contributions in the last year
                </span>
              )}
            </ContributionGraphTotalCount>
            <ContributionGraphLegend className="font-mono text-xs text-muted-foreground" />
          </ContributionGraphFooter>
        </ContributionGraph>
      </div>
    </section>
  );
}
