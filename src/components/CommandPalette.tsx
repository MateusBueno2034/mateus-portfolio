import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Command, Search, SunMoon } from "lucide-react";
import { useAchievements } from "../lib/achievements";
import { useTheme } from "../lib/theme";

type CommandItem = {
  label: string;
  detail: string;
  target?: string;
  action?: () => void;
};

const destinations = [
  { label: "Início", detail: "Apresentação", target: "hero" },
  { label: "Sobre", detail: "Trajetória", target: "sobre" },
  { label: "Stack", detail: "Tecnologias", target: "tecnologias" },
  { label: "Projetos", detail: "Cases", target: "projetos" },
  { label: "Interactive Lab", detail: "Jogos e experimentos", target: "lab" },
  { label: "Cursos", detail: "Formação", target: "cursos" },
  { label: "Contato", detail: "Vamos conversar", target: "contato" },
  { label: "Finora", detail: "Case study", target: "projeto-finora" },
  { label: "SpeakUp", detail: "Case study", target: "projeto-speakup" },
  { label: "SmokeHouse", detail: "Case study", target: "projeto-smokehouse" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleAtmosphere } = useTheme();
  const { unlock } = useAchievements();

  const items = useMemo<CommandItem[]>(
    () => [
      ...destinations,
      {
        label: "Alternar atmosfera",
        detail: "Mudar entre grafite e suave",
        action: toggleAtmosphere,
      },
    ],
    [toggleAtmosphere],
  );
  const filteredItems = items.filter((item) =>
    `${item.label} ${item.detail}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

  const showPalette = () => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
    unlock("command-user");
  };

  const closePalette = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) closePalette();
        else showPalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog?.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(filteredItems.length - 1, 0)));
  }, [filteredItems.length]);

  const execute = (item: CommandItem) => {
    closePalette();
    if (item.action) {
      item.action();
      return;
    }
    const target = item.target;
    if (target) {
      window.requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={showPalette}
        aria-label="Abrir ações e navegação rápida"
        aria-haspopup="dialog"
        className="focus-state inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border border-[var(--border)] px-2.5 text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
      >
        <Command size={15} aria-hidden="true" />
        <span className="hidden text-[10px] sm:inline">K</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Command Palette"
        onClose={() => setOpen(false)}
        onCancel={(event) => {
          event.preventDefault();
          closePalette();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closePalette();
          }
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closePalette();
        }}
        className="m-auto max-h-[min(78dvh,38rem)] w-[min(38rem,calc(100vw-2rem))] max-w-none overflow-hidden border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-0 text-[var(--text-primary)] shadow-[var(--shadow-elevated)]"
      >
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
          <Search size={16} aria-hidden="true" className="shrink-0 text-[var(--text-muted)]" />
          <label htmlFor="command-search" className="sr-only">
            Pesquisar ações
          </label>
          <input
            ref={inputRef}
            id="command-search"
            aria-controls="command-results"
            aria-activedescendant={
              filteredItems[activeIndex]
                ? `command-option-${activeIndex}`
                : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => (index + 1) % Math.max(filteredItems.length, 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex(
                  (index) => (index - 1 + Math.max(filteredItems.length, 1)) % Math.max(filteredItems.length, 1),
                );
              } else if (event.key === "Enter" && filteredItems[activeIndex]) {
                event.preventDefault();
                execute(filteredItems[activeIndex]);
              }
            }}
            placeholder="Para onde vamos?"
            className="min-h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
          />
          <kbd className="hidden border border-[var(--border)] px-1.5 py-1 text-[10px] text-[var(--text-muted)] sm:block">
            ESC
          </kbd>
        </div>
        <div className="max-h-[min(55dvh,28rem)] overflow-y-auto p-2">
          {filteredItems.length ? (
            <ul id="command-results" role="listbox" aria-label="Ações disponíveis">
              {filteredItems.map((item, index) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => execute(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    id={`command-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={`focus-state flex min-h-12 w-full items-center gap-3 px-3 text-left text-sm ${
                      index === activeIndex
                        ? "bg-[var(--accent-muted)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {item.action ? (
                      <SunMoon size={14} aria-hidden="true" />
                    ) : (
                      <ArrowRight size={14} aria-hidden="true" />
                    )}
                    <span className="flex-1">{item.label}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.detail}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
              Nenhuma ação encontrada.
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
