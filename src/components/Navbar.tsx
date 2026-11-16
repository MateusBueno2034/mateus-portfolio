import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { microInteraction, motionTransitions } from "../lib/motion";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { AudioToggle } from "./AudioToggle";
import { useAudio } from "../lib/audio";

const links = [
  { href: "#hero", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#tecnologias", label: "Tecnologias" },
  { href: "#projetos", label: "Projetos" },
  { href: "#lab", label: "Lab" },
  { href: "#cursos", label: "Cursos" },
];

const sectionIds = [...links.map(({ href }) => href.slice(1)), "contato"];

export function Navbar() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { play } = useAudio();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    play("menu-close");
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, [play]);

  useEffect(() => {
    const updateScrollState = () => {
      const nextScrolled = window.scrollY > 16;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-24% 0px -64% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    const updateFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (sectionIds.includes(hash)) setActiveSection(hash);
    };

    window.addEventListener("hashchange", updateFromHash);
    updateFromHash();

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLinkRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };

    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    desktopQuery.addEventListener("change", closeOnDesktop);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      desktopQuery.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeMenu, open]);

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    play("navigate");
    closeMenu();
  };

  const linkClass = (id: string) =>
    `focus-state relative inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--motion-duration-fast)] ${
      activeSection === id
        ? "text-[var(--text-primary)]"
        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    }`;

  return (
    <header
      data-site-navbar
      onKeyDown={(event) => {
        if (!open || event.key !== "Tab") return;

        const menuLinks = Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            "#mobile-navigation a[href]",
          ),
        );
        const firstFocusable = menuButtonRef.current;
        const lastFocusable = menuLinks[menuLinks.length - 1];

        if (
          event.shiftKey &&
          document.activeElement === firstFocusable &&
          lastFocusable
        ) {
          event.preventDefault();
          lastFocusable.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastFocusable &&
          firstFocusable
        ) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }}
      className={`fixed inset-x-0 top-0 z-50 isolate border-b transition-[background-color,border-color] duration-[var(--motion-duration-standard)] ${
        scrolled
          ? "border-[var(--border)] bg-[var(--background-primary)]/95 shadow-[var(--shadow-subtle)] backdrop-blur-md"
          : "border-transparent bg-[var(--background-primary)]/70"
      }`}
    >
      <div
        className={`relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-[var(--motion-duration-standard)] sm:px-8 lg:px-10 ${
          scrolled ? "h-16" : "h-[4.5rem]"
        }`}
      >
        <a
          href="#hero"
          onClick={() => handleNavigate("hero")}
          aria-label="Mateus — início"
          className="focus-state inline-flex min-h-11 items-center gap-2.5 rounded-sm"
        >
          <span className="text-lg font-medium tracking-[-0.06em] text-[var(--text-primary)]">
            M<span className="text-[var(--accent)]">.</span>
          </span>
          <span className="hidden text-sm tracking-wide text-[var(--text-secondary)] sm:inline">
            Mateus Bueno
          </span>
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
          {links.map(({ href, label }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;

            return (
              <motion.a
                key={href}
                href={href}
                onClick={() => handleNavigate(id)}
                aria-current={isActive ? "location" : undefined}
                whileHover={microInteraction.hover}
                whileTap={microInteraction.tap}
                className={linkClass(id)}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-section"
                    className="absolute inset-x-0 bottom-1 h-px bg-[var(--accent)]"
                    transition={motionTransitions.fast}
                    aria-hidden="true"
                  />
                )}
              </motion.a>
            );
          })}
        </nav>

        <ThemeToggle compact />
        <AudioToggle id="navbar-volume" />
        <CommandPalette />
        <motion.a
          href="#contato"
          onClick={() => handleNavigate("contato")}
          whileHover={microInteraction.hover}
          whileTap={microInteraction.tap}
          className={`focus-state hidden min-h-10 items-center rounded-[var(--radius-small)] border px-4 text-sm transition-colors duration-[var(--motion-duration-fast)] lg:inline-flex ${
            activeSection === "contato"
              ? "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-primary)]"
              : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
          }`}
        >
          Vamos conversar
        </motion.a>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => {
            if (open) closeMenu();
            else {
              play("menu-open");
              setOpen(true);
            }
          }}
          className="focus-state inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-small)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={20} strokeWidth={1.7} /> : <Menu size={20} strokeWidth={1.7} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={motionTransitions.standard}
            style={{ pointerEvents: open ? "auto" : "none" }}
            className="fixed inset-0 z-10 overflow-y-auto bg-[var(--background-primary)] px-6 pb-10 pt-28 sm:px-8 lg:hidden"
          >
            <nav
              aria-label="Navegação móvel"
              className="mx-auto flex min-h-[calc(100dvh-10rem)] max-w-lg flex-col"
            >
              <div className="mb-7 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Navegação
              </div>
              <div className="flex flex-col">
                {links.map(({ href, label }, index) => {
                  const id = href.slice(1);
                  const isActive = activeSection === id;

                  return (
                    <motion.a
                      key={href}
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      href={href}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, x: -10 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.01 : 0.42,
                        delay: prefersReducedMotion ? 0 : index * 0.045,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onClick={() => handleNavigate(id)}
                      aria-current={isActive ? "location" : undefined}
                      className={`focus-state flex min-h-14 items-center border-b border-[var(--border)] text-2xl font-medium tracking-[-0.04em] ${
                        isActive
                          ? "text-[var(--accent)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {label}
                    </motion.a>
                  );
                })}
              </div>
              <a
                href="#contato"
                onClick={() => handleNavigate("contato")}
                className="group focus-state mt-auto flex min-h-14 items-center justify-between border-b border-[var(--border)] pt-8 text-sm text-[var(--text-secondary)]"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  Vamos conversar
                </span>
                <span
                  aria-hidden="true"
                  className="text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
