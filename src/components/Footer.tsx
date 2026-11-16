import { ArrowUpRight } from "lucide-react";

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--section-contact)] px-6 py-7 transition-colors duration-[var(--motion-duration-standard)] lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="#hero"
          aria-label="Voltar ao início"
          className="focus-state inline-flex min-h-11 items-center gap-3 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <span className="text-lg font-medium tracking-[-0.06em] text-[var(--text-primary)]">
            M<span className="text-[var(--accent)]">.</span>
          </span>
          Mateus Henrique Bueno de Carvalho
        </a>

        <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          © {currentYear} · Feito com intenção
        </p>

        <a
          href="https://github.com/MateusBueno2034"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub (abre em nova aba)"
          className="focus-state inline-flex min-h-11 items-center gap-2 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          GitHub <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
