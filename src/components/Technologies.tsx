import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { technologies } from "../lib/technologies";

export function Technologies() {
  const [selectedName, setSelectedName] = useState(technologies[0].name);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const selectedTechnology =
    technologies.find((technology) => technology.name === selectedName) ??
    technologies[0];
  const selectedIndex = technologies.findIndex(
    (technology) => technology.name === selectedTechnology.name,
  );
  const transition = {
    duration: prefersReducedMotion ? 0.01 : 0.34,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("portfolio:focus", { detail: technologies[0].name }),
    );
  }, []);

  return (
    <section
      id="tecnologias"
      aria-labelledby="technologies-heading"
      className="relative overflow-hidden px-6 py-24 sm:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-[var(--border)] pb-12 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.62fr)] md:items-end md:gap-16 lg:pb-16">
          <div>
            <p className="eyebrow mb-6">02 / Stack</p>
            <h2
              id="technologies-heading"
              className="max-w-3xl text-4xl leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
            >
              Tecnologias que dão forma às ideias.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)] md:justify-self-end">
            Uma seleção do que aparece nos projetos — e de como cada ferramenta
            participa deles.
          </p>
        </div>

        <div className="grid gap-12 pt-10 md:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.28fr)] md:gap-16 md:pt-14 lg:grid-cols-[minmax(15rem,0.78fr)_minmax(0,1.22fr)] lg:gap-24">
          <div>
            <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span>Índice</span>
              <span>{technologies.length.toString().padStart(2, "0")} itens</span>
            </div>
            <div
              role="list"
              aria-label="Tecnologias"
              className="border-t border-[var(--border)]"
            >
              {technologies.map((technology, index) => {
                const isSelected = technology.name === selectedTechnology.name;

                return (
                  <div
                    role="listitem"
                    key={technology.name}
                    className={`relative border-b border-[var(--border)] transition-opacity duration-300 ${
                      isSelected ? "opacity-100" : "opacity-65 hover:opacity-100"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="technology-active-indicator"
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-px bg-[var(--text-primary)]"
                        transition={transition}
                      />
                    )}
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-controls="technology-detail"
                      onClick={() => {
                        setSelectedName(technology.name);
                        window.dispatchEvent(
                          new CustomEvent("portfolio:focus", {
                            detail: technology.name,
                          }),
                        );
                      }}
                      className="group flex min-h-12 w-full items-center gap-4 py-3 pl-4 pr-1 text-left focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    >
                      <span className="w-6 shrink-0 font-mono text-[10px] text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-secondary)]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 text-sm tracking-wide transition-colors ${
                          isSelected
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {technology.name}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`text-xs transition-transform duration-200 group-hover:translate-x-0.5 ${
                          isSelected
                            ? "translate-x-0 text-[var(--text-primary)]"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        ↗
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            id="technology-detail"
            aria-live="polite"
            aria-atomic="true"
            className="relative min-h-72 border-t border-[var(--border)] pt-6 sm:min-h-80 md:border-t-0 md:border-l md:pl-10 md:pt-0 lg:pl-16"
          >
            <div className="mb-10 flex items-center justify-between gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Tecnologia selecionada
              </span>
              <motion.span
                key={selectedIndex}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transition}
                className="font-mono text-xs tabular-nums text-[var(--text-muted)]"
              >
                {(selectedIndex + 1).toString().padStart(2, "0")} /{" "}
                {technologies.length.toString().padStart(2, "0")}
              </motion.span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedTechnology.name}
                initial={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : 8,
                  y: prefersReducedMotion ? 0 : 3,
                  filter: prefersReducedMotion ? "blur(0px)" : "blur(3px)",
                  scale: prefersReducedMotion ? 1 : 0.99,
                }}
                animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)", scale: 1 }}
                exit={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : -5,
                  y: 0,
                  filter: prefersReducedMotion ? "blur(0px)" : "blur(2px)",
                }}
                transition={transition}
              >
                <div aria-hidden="true" className="technology-depth-orbit">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {selectedTechnology.category}
                </div>
                <h3 className="text-3xl tracking-tight text-[var(--text-primary)] sm:text-4xl">
                  {selectedTechnology.name}
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[var(--text-secondary)]">
                  {selectedTechnology.description}
                </p>

                <div className="mt-10 border-t border-[var(--border)] pt-5">
                  <h4 className="mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Presente em
                  </h4>
                  {selectedTechnology.projects.length > 0 ? (
                    <ol className="space-y-1">
                      {selectedTechnology.projects.map((project) => (
                        <li key={project.name}>
                          <a
                            href="#projetos"
                            aria-label={`Ver ${project.name} na seção de projetos`}
                            className="group flex min-h-11 items-center gap-4 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                          >
                            <span className="font-mono text-[10px] text-[var(--text-muted)]">
                              {project.number}
                            </span>
                            <span>{project.name}</span>
                            <span
                              aria-hidden="true"
                              className="ml-auto text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                            >
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">
                      Conhecimento complementar, ainda sem projeto listado.
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
