import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { revealVariants, staggerVariants, motionTransitions } from "../lib/motion";
import { useAudio } from "../lib/audio";

const HOLD_DURATION = 2200;
const PortfolioScene = lazy(() =>
  import("./3d/PortfolioScene").then((module) => ({
    default: module.PortfolioScene,
  })),
);

export function Intro() {
  const motionPreference = useReducedMotion();
  const prefersReducedMotion =
    motionPreference ??
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const introRef = useRef<HTMLDivElement>(null);
  const holdButtonRef = useRef<HTMLButtonElement>(null);
  const holdFrame = useRef<number | null>(null);
  const holdStartedAt = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReleasing, setIsReleasing] = useState(false);
  const {
    startIntroCharge,
    updateIntroCharge,
    cancelIntroCharge,
    completeIntroCharge,
  } = useAudio();

  const completeEntry = useCallback(() => {
    setIsReleasing(true);
    completeIntroCharge();
    const timeline = gsap.timeline({
      onComplete: () => setIsVisible(false),
    });
    timeline.to(introRef.current, {
      yPercent: -100,
      opacity: 0,
      delay: prefersReducedMotion ? 0.06 : 0.82,
      duration: prefersReducedMotion ? 0.18 : 0.78,
      ease: "power3.inOut",
    });
  }, [completeIntroCharge, prefersReducedMotion]);

  const stopHolding = useCallback(() => {
    if (isReleasing) return;
    setIsHolding(false);
    if (holdFrame.current !== null) {
      cancelAnimationFrame(holdFrame.current);
      holdFrame.current = null;
    }
    if (progress < 1) cancelIntroCharge();
    setProgress(0);
  }, [cancelIntroCharge, isReleasing, progress]);

  const updateHold = useCallback(
    (now: number) => {
      const next = Math.min(1, (now - holdStartedAt.current) / HOLD_DURATION);
      setProgress(next);
      updateIntroCharge(next);
      if (next >= 1) {
        holdFrame.current = null;
        setIsHolding(false);
        completeEntry();
        return;
      }
      holdFrame.current = requestAnimationFrame(updateHold);
    },
    [completeEntry, updateIntroCharge],
  );

  const startHolding = useCallback(() => {
    if (isReleasing || isHolding) return;
    setIsHolding(true);
    holdStartedAt.current = performance.now();
    startIntroCharge();
    holdFrame.current = requestAnimationFrame(updateHold);
  }, [isHolding, isReleasing, startIntroCharge, updateHold]);

  useEffect(() => {
    if (!isVisible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    holdButtonRef.current?.focus();
    const cancelOnBlur = () => {
      if (holdFrame.current !== null) {
        cancelAnimationFrame(holdFrame.current);
        holdFrame.current = null;
      }
      setIsHolding(false);
      setProgress(0);
      cancelIntroCharge();
    };
    const cancelWhenHidden = () => {
      if (document.hidden) stopHolding();
    };
    window.addEventListener("blur", cancelOnBlur);
    document.addEventListener("visibilitychange", cancelWhenHidden);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("blur", cancelOnBlur);
      document.removeEventListener("visibilitychange", cancelWhenHidden);
      if (holdFrame.current !== null) cancelAnimationFrame(holdFrame.current);
    };
  }, [cancelIntroCharge, isVisible]);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          key="portfolio-intro"
          ref={introRef}
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0, transition: motionTransitions.exit }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[var(--background-primary)] py-7 sm:py-10"
          style={{ pointerEvents: isReleasing ? "none" : "auto" }}
          role="dialog"
          aria-modal="true"
          aria-label="Introdução ao portfólio de Mateus Henrique"
        >
          <div className="site-container relative z-10 flex items-center justify-between">
            <span className="text-xs font-medium tracking-[0.18em] text-[var(--text-secondary)]">
              M<span className="text-[var(--accent)]">.</span>
            </span>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Entrada interativa
            </span>
          </div>

          <motion.div
            className="site-container relative z-10 w-full"
            variants={staggerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            animate="visible"
            transition={{ delay: prefersReducedMotion ? 0 : 2.4 }}
          >
            <motion.p variants={revealVariants} className="eyebrow mb-5 sm:mb-7">
              Portfólio · 2026
            </motion.p>
            <motion.h1
              variants={revealVariants}
              transition={{ duration: 1.2, delay: prefersReducedMotion ? 0 : 0.25 }}
              className="max-w-5xl text-[clamp(2.75rem,10vw,8rem)] font-medium leading-[0.92] tracking-[-0.075em] text-[var(--text-primary)]"
            >
              Mateus Henrique
              <br />
              <span className="text-[var(--text-secondary)]">
                Bueno de Carvalho
              </span>
            </motion.h1>
            <motion.div
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ ...motionTransitions.standard, delay: prefersReducedMotion ? 0 : 0.2 }}
              className="mt-7 h-px w-full max-w-5xl origin-left bg-[var(--border-strong)] sm:mt-9"
            />
            <motion.p
              variants={revealVariants}
              transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : 0.45 }}
              className="mt-5 text-xs tracking-[0.08em] text-[var(--text-secondary)] sm:mt-6 sm:text-sm"
            >
              Engenharia de Software <span className="px-2 text-[var(--text-muted)]">/</span> Desenvolvimento Front-End
            </motion.p>
          </motion.div>

          <Suspense fallback={null}>
            <PortfolioScene
              variant="intro"
              interactive={!prefersReducedMotion}
              interactionProgress={progress}
              releasing={isReleasing}
              className="pointer-events-none absolute inset-0 opacity-45"
            />
          </Suspense>

          <div className="site-container relative z-10 flex flex-col gap-5 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="block">Design · Código · Experiência</span>
              <span className="mt-3 block text-[var(--text-secondary)]">
                {isHolding ? "Energia acumulada" : "A passagem está aguardando você"}
              </span>
            </div>
            <button
              ref={holdButtonRef}
              type="button"
              aria-label="Segure para liberar o acesso ao portfólio"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-describedby="intro-hold-instructions"
              onPointerDown={(event) => {
                event.preventDefault();
                startHolding();
              }}
              onPointerUp={stopHolding}
              onPointerCancel={stopHolding}
              onPointerLeave={stopHolding}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  startHolding();
                }
              }}
              onKeyUp={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  stopHolding();
                }
              }}
              onContextMenu={(event) => event.preventDefault()}
              className="focus-state group relative flex min-h-14 min-w-64 items-center justify-center overflow-hidden border border-[var(--border-strong)] px-6 text-[0.65rem] font-medium tracking-[0.16em] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left bg-[var(--accent-muted)] transition-transform duration-75"
                style={{ transform: `scaleX(${progress})` }}
              />
              <span className="relative z-10">
                {isReleasing ? "Acesso liberado" : "Segure para liberar o acesso"}
              </span>
            </button>
            <span id="intro-hold-instructions" className="sr-only" aria-live="polite">
              {Math.round(progress * 100)} por cento carregado. Use o mouse, toque, Espaço ou Enter e mantenha pressionado por aproximadamente dois segundos.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
