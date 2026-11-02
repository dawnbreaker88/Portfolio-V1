"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  bind,
  unlock,
  setEnabled,
  play,
  type SoundName,
  type PlayOptions,
} from "cuelume";

type SoundContextType = {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (name?: SoundName, options?: PlayOptions) => void;
};

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

export function useSound() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const saved = localStorage.getItem("cuelume-sound-enabled");
      if (saved !== null) {
        return saved === "true";
      }
    } catch {
      // Ignore storage restrictions
    }
    return true;
  });

  useEffect(() => {
    // 1. Bind cuelume declarative listeners across document
    const unbind = bind();
    setEnabled(soundEnabled);

    return () => {
      unbind();
    };
  }, [soundEnabled]);

  const toggleSound = useCallback(async () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setEnabled(next);

    try {
      localStorage.setItem("cuelume-sound-enabled", String(next));
    } catch {
      // Ignore
    }

    if (next) {
      const unlocked = await unlock();
      if (unlocked) {
        play("toggle", { emphasis: "subtle" });
      }
    }
  }, [soundEnabled]);

  const playSound = useCallback(
    (name?: SoundName, options?: PlayOptions) => {
      if (soundEnabled) {
        play(name, options);
      }
    },
    [soundEnabled]
  );

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}
