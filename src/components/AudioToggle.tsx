import { Volume2, VolumeX, Check, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useAudio } from "../lib/audio";
import type { SoundName } from "../lib/audioManager";

export function AudioToggle({ id = "portfolio-volume" }: { id?: string }) {
  const { enabled, volume, toggle, setVolume, play } = useAudio();
  const [open, setOpen] = useState(false);
  const [testSound, setTestSound] = useState<SoundName>("confirm");
  const testSounds: Array<[SoundName, string]> = [
    ["menu-open", "Abrir menu"], ["menu-close", "Fechar menu"], ["navigate", "Navegação"],
    ["project", "Projeto"], ["achievement", "Conquista"], ["intro", "Introdução"],
    ["game-start", "Início de jogo"], ["hit", "Colisão"], ["block", "Bloco"], ["line", "Linha"],
    ["card", "Carta"], ["type", "Digitação"], ["clear", "Limpeza"],
  ];
  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={enabled ? "Desativar áudio" : "Ativar áudio"}
        title={enabled ? "Desativar áudio" : "Ativar áudio"}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={`focus-state inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-small)] transition-colors hover:bg-[var(--surface)] ${
          enabled ? "text-[var(--text-secondary)]" : "text-[var(--error-color)]"
        }`}
      >
        {enabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Abrir configurações de áudio"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="focus-state inline-flex min-h-11 min-w-9 items-center justify-center rounded-[var(--radius-small)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
      >
        <SlidersHorizontal size={14} aria-hidden="true" />
      </button>
      {open && (
        <div
          id={`${id}-panel`}
          role="group"
          aria-label="Configurações de áudio"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] w-56 rounded-[var(--radius-medium)] border border-[var(--border-strong)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-elevated)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              Efeitos sonoros
            </p>
            <button type="button" onClick={toggle} className="text-[0.65rem] text-[var(--accent)]">
              {enabled ? "Desativar" : "Ativar"}
            </button>
          </div>
          <label className="mt-4 block text-xs text-[var(--text-secondary)]" htmlFor={id}>
            Volume: {Math.round(volume * 100)}%
          </label>
          <input id={id} type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => setVolume(Number(event.target.value))} disabled={!enabled} className="mt-2 w-full accent-[var(--accent)] disabled:opacity-45" />
          <div className="mt-3 flex gap-2">
            <select aria-label="Efeito para teste" value={testSound} onChange={(event) => setTestSound(event.target.value as SoundName)} className="min-w-0 flex-1 border border-[var(--border)] bg-[var(--surface)] px-2 text-xs text-[var(--text-secondary)]">
              {testSounds.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="button" onClick={() => play(testSound)} disabled={!enabled} className="focus-state inline-flex min-h-9 items-center justify-center gap-2 border border-[var(--border)] px-2 text-xs text-[var(--text-secondary)] disabled:opacity-45">
              <Check size={13} aria-hidden="true" /> Ouvir
            </button>
          </div>
          <p className="mt-2 text-[0.65rem] leading-4 text-[var(--text-muted)]">
            {enabled ? "Áudio ativado" : "Áudio desativado"}
          </p>
        </div>
      )}
    </div>
  );
}
