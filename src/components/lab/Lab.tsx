import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { ExperimentRunner } from "./ExperimentRunner";
import { experiments, type Experiment, type ExperimentId } from "./experiments";
import { useAchievements } from "../../lib/achievements";
import { revealVariants, staggerVariants } from "../../lib/motion";

export function Lab() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { unlock } = useAchievements();
  const [activeExperiment, setActiveExperiment] =
    useState<ExperimentId | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeDetails = experiments.find(
    (experiment) => experiment.id === activeExperiment,
  );

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:lab-modal", { detail: Boolean(activeExperiment) }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("portfolio:lab-modal", { detail: false }),
      );
    };
  }, [activeExperiment]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeExperiment && !dialog.open) {
      dialog.showModal();
    } else if (!activeExperiment && dialog.open) {
      dialog.close();
    }
  }, [activeExperiment]);

  const closeExperiment = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setActiveExperiment(null);
  };

  return (
    <section
      id="lab"
      aria-labelledby="lab-heading"
      className="relative overflow-hidden px-6 py-24 sm:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 border-y border-[var(--border)] py-8 sm:py-10 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.62fr)] md:items-end md:gap-16">
          <div>
            <p className="eyebrow mb-6">Interactive lab</p>
            <motion.h2
              id="lab-heading"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.7 }}
              className="max-w-3xl text-4xl leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
            >
              Pequenas ideias, em movimento.
            </motion.h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)] md:justify-self-end">
            Jogos e experimentos curtos para explorar interação, lógica e
            movimento — abra um quando quiser.
          </p>
        </header>

        <motion.ol
          variants={staggerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="mt-8 border-t border-[var(--border)]"
        >
          {experiments.map((experiment, index) => (
            <motion.li
              key={experiment.id}
              variants={revealVariants}
              data-lab-experiment={experiment.id}
              className="group/experiment border-b border-[var(--border)]"
              onPointerEnter={() =>
                window.dispatchEvent(
                  new CustomEvent("portfolio:focus", { detail: `lab:${experiment.id}` }),
                )
              }
              onFocusCapture={() =>
                window.dispatchEvent(
                  new CustomEvent("portfolio:focus", { detail: `lab:${experiment.id}` }),
                )
              }
              onPointerLeave={() =>
                window.dispatchEvent(new CustomEvent("portfolio:focus", { detail: "" }))
              }
            >
              <button
                type="button"
                onClick={() => {
                  unlock("lab-explorer");
                  window.dispatchEvent(
                    new CustomEvent("portfolio:focus", { detail: `lab:${experiment.id}` }),
                  );
                  setActiveExperiment(experiment.id);
                }}
                aria-haspopup="dialog"
                aria-controls="lab-experiment-dialog"
                aria-label={`Abrir ${experiment.name}. ${experiment.description}`}
                style={
                  { "--experiment-accent": experiment.accent } as CSSProperties
                }
                className="group flex min-h-24 w-full items-center gap-3 py-5 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--experiment-accent)] sm:min-h-28 sm:gap-7"
              >
                <span aria-hidden="true" className="lab-depth-mark" />
                <span className="w-7 shrink-0 font-mono text-xs tabular-nums text-[var(--text-muted)]">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg tracking-tight text-[var(--text-primary)] transition-transform duration-200 group-hover:translate-x-1 sm:text-xl">
                    {experiment.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--text-secondary)] sm:text-sm">
                    {experiment.description}
                  </span>
                </span>
                <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)] sm:inline">
                  {experiment.kind} · {experiment.controls}
                </span>
                <ExperimentPreview experiment={experiment} />
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--text-muted)] transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--experiment-accent)]"
                />
              </button>
            </motion.li>
          ))}
        </motion.ol>
      </div>

      <dialog
        ref={dialogRef}
        id="lab-experiment-dialog"
        aria-labelledby="lab-dialog-title"
        onClose={() => setActiveExperiment(null)}
        onCancel={(event) => {
          event.preventDefault();
          closeExperiment();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeExperiment();
          }
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeExperiment();
        }}
        className="m-auto max-h-[min(90dvh,52rem)] w-[min(56rem,calc(100vw-2rem))] max-w-none overflow-y-auto border border-[var(--border)] border-t-2 bg-[var(--background-secondary)] p-0 text-[var(--text-primary)] shadow-[var(--shadow-elevated)]"
        style={
          activeDetails
            ? ({
                "--experiment-accent": activeDetails.accent,
                borderTopColor: activeDetails.accent,
                backgroundImage: `radial-gradient(ellipse 36rem 20rem at 100% 0, ${activeDetails.accent}14, transparent 74%)`,
              } as CSSProperties)
            : undefined
        }
      >
        {activeDetails && (
          <div className="p-5 sm:p-8">
            <header className="mb-7 flex items-start justify-between gap-4 border-b border-[var(--border)] pb-5">
              <div>
                <p className="eyebrow mb-3">Interactive lab / {activeDetails.kind}</p>
                <h3
                  id="lab-dialog-title"
                  className="text-2xl tracking-tight sm:text-3xl"
                >
                  {activeDetails.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {activeDetails.description}
                </p>
              </div>
              <button
                type="button"
                onClick={closeExperiment}
                aria-label="Fechar experimento"
                className="focus-state inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <ExperimentRunner experimentId={activeDetails.id} />
          </div>
        )}
      </dialog>
    </section>
  );
}

function ExperimentPreview({ experiment }: { experiment: Experiment }) {
  const accent = experiment.accent;

  return (
    <span
      aria-hidden="true"
      className="relative hidden h-14 w-[5.5rem] shrink-0 items-center justify-center overflow-hidden border bg-[var(--surface)] sm:flex"
      style={{
        borderColor: `${accent}40`,
        background: `radial-gradient(circle at 50% 50%, ${accent}16, transparent 78%)`,
      }}
    >
      {experiment.id === "snake" && (
        <span className="flex items-center">
          <i className="lab-preview-snake h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          <i className="h-2 w-2 rounded-sm" style={{ backgroundColor: `${accent}cc` }} />
          <i className="h-2 w-2 rounded-sm" style={{ backgroundColor: `${accent}99` }} />
          <i className="ml-3 h-1.5 w-1.5 rounded-full bg-[#d5a878] shadow-[0_0_7px_2px_rgb(213_168_120_/_45%)]" />
        </span>
      )}
      {experiment.id === "tetris" && (
        <span className="lab-preview-piece grid grid-cols-3 gap-0.5">
          {[0, 1, 2, 3, 4, 5].map((cell) => (
            <i key={cell} className="h-2.5 w-2.5" style={{ backgroundColor: cell > 2 ? `${accent}8c` : accent }} />
          ))}
        </span>
      )}
      {experiment.id === "pong" && (
        <span className="relative flex h-8 w-12 items-center justify-between">
          <i className="h-5 w-1 rounded-full" style={{ backgroundColor: accent }} />
          <i className="lab-preview-pong h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
          <i className="h-6 w-1 rounded-full bg-white/40" />
        </span>
      )}
      {experiment.id === "breakout" && (
        <span className="lab-preview-breakout grid grid-cols-4 gap-0.5">
          {Array.from({ length: 8 }, (_, index) => (
            <i key={index} className="h-1.5 w-2.5" style={{ backgroundColor: index < 4 ? accent : `${accent}80` }} />
          ))}
        </span>
      )}
      {experiment.id === "memory" && (
        <span className="grid grid-cols-2 gap-1">
          {["◇", "◉", "◇", "·"].map((symbol, index) => (
            <i key={index} className={`flex h-4 w-4 items-center justify-center border text-[10px] not-italic ${index === 1 ? "lab-preview-memory" : ""}`} style={{ color: accent, borderColor: `${accent}70` }}>{symbol}</i>
          ))}
        </span>
      )}
      {experiment.id === "typing" && (
        <span className="font-mono text-xl tracking-[-0.1em]" style={{ color: accent }}>
          Aa<span className="lab-preview-caret ml-1 inline-block h-4 w-px align-middle" style={{ backgroundColor: accent }} />
        </span>
      )}
      {experiment.id === "drawing" && (
        <svg viewBox="0 0 64 32" className="h-8 w-14" fill="none">
          <path className="lab-preview-drawing" d="M3 23C12 2 19 27 28 13S42 4 47 20s10 3 14-9" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="80" />
        </svg>
      )}
    </span>
  );
}
