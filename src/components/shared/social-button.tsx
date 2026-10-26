"use client";

import {
  SocialHoverCard,
  type SocialHoverCardProps,
} from "./social-hover-card";

export type SocialButtonProps = SocialHoverCardProps;

export function SocialButton(props: SocialButtonProps) {
  return <SocialHoverCard {...props} />;
}
