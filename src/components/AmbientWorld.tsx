import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import type { WorldSection } from "./3d/PortfolioScene";

const PortfolioScene = lazy(() =>
  import("./3d/PortfolioScene").then((module) => ({
    default: module.PortfolioScene,
  })),
);

type AmbientSection =
  | "hero"
  | "sobre"
  | "tecnologias"
  | "projetos"
  | "lab"
  | "cursos"
  | "contato";

const sectionOrder: AmbientSection[] = [
  "hero",
  "sobre",
  "tecnologias",
  "projetos",
  "lab",
  "cursos",
  "contato",
];

const sectionThemes: Record<
  AmbientSection,
  { accent: string; secondary: string; angle: number }
> = {
  hero: { accent: "var(--accent)", secondary: "var(--accent-about)", angle: -8 },
  sobre: { accent: "var(--accent-about)", secondary: "var(--accent)", angle: 12 },
  tecnologias: { accent: "var(--accent)", secondary: "var(--accent-about)", angle: -18 },
  projetos: { accent: "var(--accent)", secondary: "var(--accent-lab)", angle: 8 },
  lab: { accent: "var(--accent-lab)", secondary: "var(--accent)", angle: -12 },
  cursos: { accent: "var(--accent-about)", secondary: "var(--accent)", angle: 18 },
  contato: { accent: "var(--accent)", secondary: "var(--accent-about)", angle: -6 },
};

export function AmbientWorld() {
  const reducedMotion = useReducedMotion() ?? false;
  const [activeSection, setActiveSection] = useState<AmbientSection>("hero");
  const [focus, setFocus] = useState("");
  const [introActive, setIntroActive] = useState(
    () => Boolean(document.querySelector('[aria-label^="Introdução ao portfólio"]')),
  );
  const frame = useRef<number | null>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateIntro = () =>
      setIntroActive(Boolean(document.querySelector('[aria-label^="Introdução ao portfólio"]')));
    const mutationObserver = new MutationObserver(updateIntro);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    updateIntro();
    return () => mutationObserver.disconnect();
  }, []);

  useEffect(() => {
    const sections = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id as AmbientSection);
      },
      { rootMargin: "-34% 0px -48% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    const updateProgress = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        const current = document.getElementById(activeSection);
        if (!current) return;
        const distance = Math.max(1, current.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -current.getBoundingClientRect().top / distance));
        worldRef.current?.style.setProperty(
          "--ambient-angle",
          `${sectionThemes[activeSection].angle + progress * 10}deg`,
        );
        window.dispatchEvent(
          new CustomEvent("portfolio:section-progress", {
            detail: { section: activeSection, progress },
          }),
        );
      });
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [activeSection]);

  useEffect(() => {
    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setFocus(detail ?? "");
    };
    window.addEventListener("portfolio:focus", handleFocus);
    return () => window.removeEventListener("portfolio:focus", handleFocus);
  }, []);

  const theme = sectionThemes[activeSection];
  const style = {
    "--ambient-accent": theme.accent,
    "--ambient-secondary": theme.secondary,
    "--ambient-angle": `${theme.angle}deg`,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      ref={worldRef}
      data-world-section={activeSection}
      className={`ambient-world ${reducedMotion ? "ambient-world--reduced" : ""}`}
      style={style}
    >
      {!introActive && (
        <Suspense fallback={null}>
          <PortfolioScene
            variant="world"
            section={activeSection as WorldSection}
            focus={focus}
            interactive={!reducedMotion}
            className="ambient-world__scene"
            particles
          />
        </Suspense>
      )}
      <div className="ambient-world__grid" />
      <div className="ambient-world__orb ambient-world__orb--primary" />
      <div className="ambient-world__orb ambient-world__orb--secondary" />
      <div className="ambient-world__frame">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
