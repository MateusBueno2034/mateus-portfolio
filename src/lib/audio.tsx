import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { audioManager, type SoundName } from "./audioManager";

type AudioContextValue = {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (volume: number) => void;
  play: (sound: SoundName) => void;
  startIntroCharge: () => void;
  updateIntroCharge: (progress: number) => void;
  cancelIntroCharge: () => void;
  completeIntroCharge: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(audioManager.isEnabled());
  const [volume, setVolumeState] = useState(audioManager.getVolume());
  const toggle = useCallback(() => {
    const next = !enabled;
    audioManager.setEnabled(next);
    setEnabled(next);
    if (next) audioManager.play("activate");
  }, [enabled]);
  const setVolume = useCallback((next: number) => {
    audioManager.setVolume(next);
    setVolumeState(next);
  }, []);
  const play = useCallback((sound: SoundName) => audioManager.play(sound), []);
  const startIntroCharge = useCallback(() => audioManager.startIntroCharge(), []);
  const updateIntroCharge = useCallback((progress: number) => audioManager.updateIntroCharge(progress), []);
  const cancelIntroCharge = useCallback(() => audioManager.cancelIntroCharge(), []);
  const completeIntroCharge = useCallback(() => audioManager.completeIntroCharge(), []);
  const value = useMemo(
    () => ({ enabled, volume, toggle, setVolume, play, startIntroCharge, updateIntroCharge, cancelIntroCharge, completeIntroCharge }),
    [enabled, volume, toggle, setVolume, play, startIntroCharge, updateIntroCharge, cancelIntroCharge, completeIntroCharge],
  );
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio deve ser usado dentro de AudioProvider.");
  return context;
}
