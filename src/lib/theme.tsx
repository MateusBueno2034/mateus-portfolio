import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAchievements } from "./achievements";
import type { CSSProperties } from "react";

export type Atmosphere = "graphite" | "soft";

type ThemeContextValue = {
  atmosphere: Atmosphere;
  toggleAtmosphere: (origin?: { x: number; y: number }) => void;
};

type ThemeTransition = {
  color: string;
  x: number;
  y: number;
  key: number;
};

const STORAGE_KEY = "mateus-portfolio-atmosphere";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function initialAtmosphere(): Atmosphere {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "graphite" || stored === "soft") return stored;
  } catch (error) {
    console.warn("Não foi possível ler a atmosfera salva.", error);
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "soft"
    : "graphite";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [atmosphere, setAtmosphere] = useState<Atmosphere>(initialAtmosphere);
  const [transition, setTransition] = useState<ThemeTransition | null>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const transitionKey = useRef(0);
  const { unlock } = useAchievements();

  const toggleAtmosphere = useCallback(
    (origin?: { x: number; y: number }) => {
      const next = atmosphere === "graphite" ? "soft" : "graphite";
      const theme = themeRef.current;
      const bounds = theme?.getBoundingClientRect();
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (theme && bounds && !reducedMotion) {
        setTransition({
          color: getComputedStyle(theme).backgroundColor,
          x: origin?.x ?? bounds.left + bounds.width / 2,
          y: origin?.y ?? bounds.top + bounds.height / 2,
          key: ++transitionKey.current,
        });
      } else {
        setTransition(null);
      }

      setAtmosphere(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch (error) {
        console.warn("Não foi possível salvar a atmosfera escolhida.", error);
      }
      unlock("atmosphere-shifter");
    },
    [atmosphere, unlock],
  );

  return (
    <ThemeContext.Provider value={{ atmosphere, toggleAtmosphere }}>
      <div
        ref={themeRef}
        data-atmosphere={atmosphere}
        className="portfolio-theme dark min-h-screen overflow-x-hidden bg-[var(--background-primary)] text-[var(--text-primary)] antialiased"
      >
        {children}
        {transition && (
          <div
            key={transition.key}
            aria-hidden="true"
            className="theme-transition"
            style={
              {
                "--theme-x": `${transition.x}px`,
                "--theme-y": `${transition.y}px`,
                backgroundColor: transition.color,
              } as CSSProperties
            }
            onAnimationEnd={(event) => {
              if (event.currentTarget === event.target) setTransition(null);
            }}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }
  return context;
}
