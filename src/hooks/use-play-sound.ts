"use client";

import * as React from "react";
import { useSound } from "@/providers/sound-provider";
import type { SoundName, PlayOptions } from "cuelume";

export interface UsePlaySoundOptions {
  sound?: SoundName;
  options?: PlayOptions;
}

export interface UsePlaySoundReturn {
  play: () => void;
  enabled: boolean;
}

export function usePlaySound(
  soundOrOptions?: SoundName | UsePlaySoundOptions
): UsePlaySoundReturn {
  const { playSound, soundEnabled } = useSound();

  const soundName =
    typeof soundOrOptions === "string" ? soundOrOptions : soundOrOptions?.sound;
  const options =
    typeof soundOrOptions === "object" ? soundOrOptions.options : undefined;

  const play = React.useCallback(() => {
    playSound(soundName, options);
  }, [playSound, soundName, options]);

  return { play, enabled: soundEnabled };
}

