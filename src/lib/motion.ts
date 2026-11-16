import type { Variants } from "motion/react";

const standardEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];
const enterEasing: [number, number, number, number] = [0.16, 1, 0.3, 1];
const exitEasing: [number, number, number, number] = [0.7, 0, 0.84, 0];

export const motionTransitions = {
  fast: { duration: 0.22, ease: standardEasing },
  standard: { duration: 0.48, ease: enterEasing },
  slow: { duration: 0.74, ease: enterEasing },
  exit: { duration: 0.18, ease: exitEasing },
  stagger: { staggerChildren: 0.085, delayChildren: 0.06 },
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransitions.standard,
  },
};

export const revealScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.975, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: motionTransitions.standard,
  },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: motionTransitions.stagger },
};

export const sectionTransitionVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: motionTransitions.slow,
  },
};

export const microInteraction = {
  hover: {
    y: -2.5,
    scale: 1.012,
    transition: motionTransitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: motionTransitions.fast,
  },
};
