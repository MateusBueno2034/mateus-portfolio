import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Award, X } from "lucide-react";
import { audioManager } from "./audioManager";

const STORAGE_KEY = "mateus-portfolio-progress";

export type AchievementId =
  | "lab-explorer"
  | "first-experiment"
  | "memory-master"
  | "project-explorer"
  | "command-user"
  | "atmosphere-shifter"
  | "lab-complete";

const achievements: Record<AchievementId, { title: string; detail: string }> = {
  "lab-explorer": {
    title: "Explorador",
    detail: "Você encontrou o Interactive Lab.",
  },
  "first-experiment": {
    title: "Primeiro experimento",
    detail: "Uma ideia saiu do papel.",
  },
  "memory-master": {
    title: "Boa memória",
    detail: "Todos os pares foram encontrados.",
  },
  "project-explorer": {
    title: "Olhar atento",
    detail: "Você explorou um projeto.",
  },
  "command-user": {
    title: "Atalho encontrado",
    detail: "A Command Palette agora faz parte da sua navegação.",
  },
  "atmosphere-shifter": {
    title: "Mudança de atmosfera",
    detail: "Você experimentou outra atmosfera visual.",
  },
  "lab-complete": {
    title: "Curiosidade sem limites",
    detail: "Você abriu todos os experimentos do Lab.",
  },
};

type Progress = {
  unlocked: AchievementId[];
  experimentCount: number;
  visitedExperiments: string[];
  bestScores: Record<string, number>;
};

type ProgressContextValue = {
  recordExperiment: (id: string, total: number) => void;
  recordBestScore: (id: string, score: number) => void;
  unlock: (id: AchievementId) => void;
};

const emptyProgress: Progress = {
  unlocked: [],
  experimentCount: 0,
  visitedExperiments: [],
  bestScores: {},
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function readProgress(): Progress {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyProgress;
    const parsed = JSON.parse(stored) as Partial<Progress>;
    return {
      unlocked: Array.isArray(parsed.unlocked)
        ? parsed.unlocked.filter(
            (id): id is AchievementId =>
              typeof id === "string" && id in achievements,
          )
        : [],
      experimentCount:
        typeof parsed.experimentCount === "number" &&
        Number.isFinite(parsed.experimentCount)
          ? parsed.experimentCount
          : 0,
      visitedExperiments: Array.isArray(parsed.visitedExperiments)
        ? parsed.visitedExperiments.filter(
            (id): id is string => typeof id === "string",
          )
        : [],
      bestScores:
        parsed.bestScores && typeof parsed.bestScores === "object"
          ? parsed.bestScores
          : {},
    };
  } catch (error) {
    console.warn("Não foi possível ler o progresso salvo do Lab.", error);
    return emptyProgress;
  }
}

function writeProgress(progress: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Não foi possível salvar o progresso do Lab.", error);
  }
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [progressRef] = useState(() => ({ current: readProgress() }));
  const [notification, setNotification] = useState<AchievementId | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const commit = useCallback((transform: (current: Progress) => Progress) => {
    const current = progressRef.current;
    const next = transform(current);
    if (next === current) return false;
    progressRef.current = next;
    writeProgress(next);
    return true;
  }, []);

  const unlock = useCallback(
    (id: AchievementId) => {
      const changed = commit((current) =>
        current.unlocked.includes(id)
          ? current
          : { ...current, unlocked: [...current.unlocked, id] },
      );
      if (changed) {
        audioManager.play("achievement");
        setNotification(id);
      }
    },
    [commit],
  );

  const recordExperiment = useCallback(
    (id: string, total: number) => {
      commit((current) => ({
        ...current,
        experimentCount: current.experimentCount + 1,
        visitedExperiments: current.visitedExperiments.includes(id)
          ? current.visitedExperiments
          : [...current.visitedExperiments, id],
      }));
      unlock("first-experiment");
      if (
        total > 0 &&
        progressRef.current.visitedExperiments.length >= total
      ) {
        unlock("lab-complete");
      }
    },
    [commit, unlock],
  );

  const recordBestScore = useCallback(
    (id: string, score: number) => {
      if (!Number.isFinite(score) || score <= 0) return;
      commit((current) =>
        (current.bestScores[id] ?? 0) >= score
          ? current
          : {
              ...current,
              bestScores: { ...current.bestScores, [id]: score },
            },
      );
    },
    [commit],
  );
  const contextValue = useMemo(
    () => ({ recordExperiment, recordBestScore, unlock }),
    [recordBestScore, recordExperiment, unlock],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!notification) return;
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setNotification(null), 3600);
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [notification]);

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {notification && (
          <motion.div
            key={notification}
            initial={prefersReducedMotion ? false : { opacity: 0, x: 18, y: 6 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, x: 12 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.36 }}
            className="pointer-events-auto flex max-w-sm items-center gap-4 border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 shadow-[var(--shadow-elevated)]"
          >
            <Award size={18} aria-hidden="true" className="shrink-0 text-[var(--accent)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Descoberta
              </p>
              <p className="mt-0.5 text-sm text-[var(--text-primary)]">
                {achievements[notification].title}
              </p>
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                {achievements[notification].detail}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              aria-label="Dispensar notificação"
              className="focus-state inline-flex min-h-10 min-w-10 items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProgressContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useAchievements deve ser usado dentro de AchievementProvider.");
  }
  return context;
}

export function useOptionalAchievements() {
  return useContext(ProgressContext);
}
