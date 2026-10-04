import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { translations, type Dict, type Lang } from "./translations";

type Prefs = { lang: Lang; t: Dict; toggleLang: () => void; sound: boolean; toggleSound: () => void; chime: () => void };

const PrefsContext = createContext<Prefs | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("jibu-lang");
    if (stored === "en" || stored === "es") setLang(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem("jibu-lang", lang);
  }, [lang]);

  const toggleSound = useCallback(() => {
    setSound((current) => {
      const next = !current;
      soundRef.current = next;
      if (next && !audio.current) audio.current = new AudioContext();
      return next;
    });
  }, []);

  const chime = useCallback(() => {
    const ctx = audio.current;
    if (!soundRef.current || !ctx || document.hidden) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  }, []);

  return (
    <PrefsContext.Provider value={{ lang, t: translations[lang], toggleLang: () => setLang((l) => (l === "es" ? "en" : "es")), sound, toggleSound, chime }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside PreferencesProvider");
  return ctx;
}
