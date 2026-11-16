import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { atmosphere, toggleAtmosphere } = useTheme();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const next = atmosphere === "graphite" ? "suave" : "grafite";

  return (
    <button
      type="button"
      onClick={(event) => {
        const { detail, clientX, clientY } = event;
        toggleAtmosphere(
          detail > 0 ? { x: clientX, y: clientY } : undefined,
        );
      }}
      aria-label={`Mudar para atmosfera ${next}`}
      title={`Mudar para atmosfera ${next}`}
      className={`focus-state inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] ${
        compact ? "min-w-11" : "px-3 text-xs"
      }`}
    >
      <span className="relative grid h-4 w-4 place-items-center overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={atmosphere}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="absolute"
          >
            {atmosphere === "graphite" ? (
              <Sun size={15} aria-hidden="true" />
            ) : (
              <Moon size={15} aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      {!compact && <span>Atmosfera</span>}
    </button>
  );
}
