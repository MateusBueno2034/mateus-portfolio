import { useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  microInteraction,
  motionTransitions,
  revealScaleVariants,
  revealVariants,
  staggerVariants,
} from "../lib/motion";
import { usePortraitDrag } from "../lib/usePortraitDrag";

const profileImage = `${import.meta.env.BASE_URL}images/profile/mateus.webp`;
const highlights = [
  { value: "2025", label: "Início da graduação" },
  { value: "10+", label: "Tecnologias" },
  { value: "15+", label: "Cursos concluídos" },
];

export function Hero() {
  const prefersReducedMotion =
    useReducedMotion() ??
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const entranceState = prefersReducedMotion
    ? { initial: false as const }
    : { initial: "hidden" as const, animate: "visible" as const };
  const pointerX = useSpring(0, { stiffness: 90, damping: 24, mass: 0.5 });
  const pointerY = useSpring(0, { stiffness: 90, damping: 24, mass: 0.5 });
  const portraitX = useMotionValue(0);
  const portraitY = useMotionValue(0);
  const portraitSpringX = useSpring(portraitX, {
    stiffness: 70,
    damping: 22,
    mass: 0.65,
  });
  const portraitSpringY = useSpring(portraitY, {
    stiffness: 70,
    damping: 22,
    mass: 0.65,
  });

  const moveWithPointer = (event: React.PointerEvent<HTMLElement>) => {
    if (
      prefersReducedMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(x * -1.5);
    pointerY.set(y * -1.5);
    portraitX.set(x * 6);
    portraitY.set(y * 5);
  };

  const resetPointerMotion = () => {
    pointerX.set(0);
    pointerY.set(0);
    portraitX.set(0);
    portraitY.set(0);
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      onPointerMove={moveWithPointer}
      onPointerLeave={resetPointerMotion}
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:px-10 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--border)]"
      />

      <div className="site-container grid w-full items-center gap-9 lg:grid-cols-[1.08fr_0.92fr] lg:grid-rows-[auto_1fr_auto] lg:gap-x-16 lg:gap-y-7 xl:gap-x-24">
        <motion.div
          variants={staggerVariants}
          {...entranceState}
          animate="visible"
          style={{ x: pointerX, y: pointerY }}
          className="relative z-10 flex flex-col items-start lg:col-start-1 lg:row-start-1"
        >
          <motion.p variants={revealVariants} className="eyebrow mb-7 sm:mb-9">
            Estudante de Engenharia de Software
          </motion.p>

          <motion.h1
            id="hero-title"
            variants={revealVariants}
            className="max-w-none text-[clamp(2.75rem,5.6vw,6rem)] font-medium leading-[0.91] tracking-[-0.075em] text-[var(--text-primary)]"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span
                initial={prefersReducedMotion ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.78,
                  delay: prefersReducedMotion ? 0 : 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                Mateus Henrique
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span
                initial={prefersReducedMotion ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.82,
                  delay: prefersReducedMotion ? 0 : 0.22,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block text-[var(--text-secondary)]"
              >
                Bueno de Carvalho
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            variants={revealVariants}
            className="mt-4 text-sm font-medium tracking-wide text-[var(--accent)] sm:mt-5 sm:text-base"
          >
            Desenvolvedor Front-End
          </motion.p>

          <motion.div
            variants={revealVariants}
            className="mt-7 flex items-center gap-2.5 text-sm text-[var(--text-secondary)] sm:mt-8"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            />
            Disponível para oportunidades de estágio
          </motion.div>

        </motion.div>

        <motion.figure
          variants={revealScaleVariants}
          {...entranceState}
          animate="visible"
          transition={motionTransitions.slow}
          className="relative mx-auto w-full max-w-xl lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:max-w-none"
        >
          <motion.div
            style={{ x: portraitSpringX, y: portraitSpringY }}
            role="img"
            aria-label="Fotografia de Mateus Henrique Bueno de Carvalho"
            className="relative aspect-[16/10] overflow-visible border border-[var(--border-strong)] bg-[var(--background-secondary)] shadow-[var(--shadow-subtle)] lg:aspect-[4/5]"
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid)_1px,transparent_1px)] bg-[size:3rem_3rem]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,var(--accent-muted),transparent_58%)]"
              />
            </div>
            <div className="absolute inset-0 z-20">
              <ProfileImage />
            </div>
          </motion.div>
          <figcaption className="mt-3 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span>Mateus Henrique Bueno de Carvalho</span>
            <span>01 / 06</span>
          </figcaption>
        </motion.figure>

        <motion.div
          variants={revealVariants}
          {...entranceState}
          animate="visible"
          className="flex flex-col items-start lg:col-start-1 lg:row-start-2"
        >
          <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
            Estudante de Engenharia de Software apaixonado por tecnologia,
            interfaces modernas e desenvolvimento de soluções digitais.
          </p>

          <div className="mt-7 flex w-full flex-wrap items-center gap-3 sm:mt-9 sm:w-auto">
            <motion.a
              href="#projetos"
              whileHover={microInteraction.hover}
              whileTap={microInteraction.tap}
              className="focus-state inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius-small)] bg-[var(--accent)] px-5 text-sm font-medium text-[var(--background-primary)] transition-colors hover:bg-[var(--text-primary)]"
            >
              Ver projetos
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </motion.a>
            <motion.a
              href="#contato"
              whileHover={microInteraction.hover}
              whileTap={microInteraction.tap}
              className="focus-state inline-flex min-h-12 items-center justify-center gap-3 rounded-[var(--radius-small)] border border-[var(--border-strong)] px-5 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-muted)]"
            >
              Contato
              <ArrowDownRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </motion.a>
          </div>
        </motion.div>

        <motion.dl
          variants={revealVariants}
          {...entranceState}
          animate="visible"
          className="grid w-full grid-cols-3 border-t border-[var(--border)] pt-5 sm:max-w-xl sm:pt-6 lg:col-start-1 lg:row-start-3 lg:mt-0"
        >
          {highlights.map(({ value, label }) => (
            <div key={label} className="pr-3 sm:pr-5">
              <dt className="text-[0.65rem] leading-5 text-[var(--text-muted)] sm:text-xs">
                {label}
              </dt>
              <dd className="mt-1 text-xl font-medium tracking-[-0.04em] text-[var(--text-primary)] sm:text-2xl">
                {value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

function ProfileImage() {
  const [hasImage, setHasImage] = useState(true);
  const {
    viewportRef,
    imageRef,
    frameRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick,
  } = usePortraitDrag();

  return (
    <div
      ref={frameRef}
      className="absolute inset-y-[6%] left-1/2 aspect-[2/3] h-[88%] w-auto -translate-x-1/2 cursor-grab border border-[var(--accent)] bg-[var(--background-secondary)] p-2 shadow-[0_0_0_1px_rgb(199_181_151_/_18%),var(--shadow-elevated)] [clip-path:polygon(12%_0,88%_0,100%_12%,100%_88%,88%_100%,12%_100%,0_88%,0_12%)] active:cursor-grabbing"
    >
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        className="relative h-full w-full touch-none select-none overflow-hidden bg-[var(--surface)] [clip-path:inherit]"
      >
        {hasImage ? (
          <img
            ref={imageRef}
            src={profileImage}
            alt="Fotografia de Mateus Henrique Bueno de Carvalho"
            width={800}
            height={1067}
            decoding="async"
            onError={() => setHasImage(false)}
            draggable={false}
            className="absolute left-1/2 top-1/2 max-w-none select-none object-cover object-center"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(145deg,var(--surface),var(--background-secondary))] px-5 text-center">
            <span className="text-6xl font-medium tracking-[-0.12em] text-[var(--text-primary)]/[0.12]">
              M
            </span>
            <span className="mt-4 text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Fotografia em breve
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
