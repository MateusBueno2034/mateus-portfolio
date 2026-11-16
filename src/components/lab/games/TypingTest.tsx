import { useEffect, useState } from "react";
import { useAudio } from "../../../lib/audio";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAchievements } from "../../../lib/achievements";

const passage =
  "Ideias ganham forma quando atenção e prática se encontram. Cada linha de código abre espaço para uma experiência mais clara.";

function countCorrectCharacters(value: string) {
  return value
    .split("")
    .filter((character, index) => character === passage[index]).length;
}

export function TypingTest() {
  const { play } = useAudio();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { recordBestScore } = useAchievements();
  const [value, setValue] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const finished = value === passage;
  const correctCharacters = countCorrectCharacters(value);
  const errors = value.length - correctCharacters;
  const accuracy = value.length
    ? Math.round((correctCharacters / value.length) * 100)
    : 100;
  const wordsPerMinute =
    elapsed > 0
      ? Math.round((correctCharacters / 5 / elapsed) * 60)
      : 0;
  const progress = Math.round((correctCharacters / passage.length) * 100);

  useEffect(() => {
    if (startedAt === null || finished) return;
    const timer = window.setInterval(
      () => setElapsed((Date.now() - startedAt) / 1000),
      250,
    );
    return () => window.clearInterval(timer);
  }, [finished, startedAt]);

  useEffect(() => {
    if (finished) recordBestScore("typing", wordsPerMinute);
  }, [finished, recordBestScore, wordsPerMinute]);

  const reset = () => {
    play("game-start");
    setValue("");
    setStartedAt(null);
    setElapsed(0);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-5 border-l-2 border-[#9caeb0] bg-[#9caeb0]/[0.06] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">
        <strong className="mr-2 font-medium text-[var(--text-primary)]">Laboratório de tipografia</strong>
        {typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
          ? "Toque no campo e use o teclado do dispositivo."
          : "Digite o trecho exatamente; erros podem ser corrigidos com Backspace."}
      </p>

      <div className="border-y border-[var(--border)] py-6 sm:py-8">
        <p
          aria-hidden="true"
          className="typing-surface font-mono text-base leading-[2.1] tracking-[-0.035em] text-[var(--text-muted)] sm:text-lg sm:leading-[2.15] lg:text-xl"
        >
          {passage.split("").map((character, index) => {
            const typed = value[index];
            const isCurrent = index === value.length && !finished;
            const correct = typed === character;
            return (
              <span
                key={index}
                className={`typing-character relative transition-colors duration-150 ${
                  typed === undefined
                    ? "text-[var(--text-muted)]"
                    : correct
                      ? "text-[var(--text-primary)]"
                      : "rounded-sm bg-[var(--error-color)]/15 text-[var(--error-color)] underline decoration-[var(--error-color)] decoration-2 underline-offset-4"
                } ${isCurrent ? "typing-current text-[var(--text-primary)]" : ""}`}
              >
                {character}
              </span>
            );
          })}
        </p>
        <p id="typing-instructions" className="sr-only">
          {passage}
        </p>
        <label htmlFor="typing-input" className="sr-only">
          Digite o texto apresentado
        </label>
        <textarea
          id="typing-input"
          value={value}
          onChange={(event) => {
            const now = Date.now();
            const next = event.target.value.slice(0, passage.length);
            const startTime = startedAt ?? now;
            if (startedAt === null && next.length > 0) setStartedAt(startTime);
            setValue(next);
            play(next.endsWith(value) ? "type" : "error");
            if (next === passage) setElapsed((now - startTime) / 1000);
          }}
          disabled={finished}
          aria-describedby="typing-instructions"
          aria-invalid={errors > 0}
          rows={2}
          placeholder="Toque ou clique aqui para começar…"
          className="focus-state mt-5 min-h-20 w-full resize-y border border-[var(--border-strong)] bg-[var(--surface)] p-4 font-mono text-sm leading-6 text-[var(--text-primary)] placeholder:font-sans placeholder:text-[var(--text-muted)] sm:mt-7 sm:text-base"
        />
      </div>

      <div
        className="mt-5 h-1 overflow-hidden bg-[var(--border)]"
        role="progressbar"
        aria-label="Progresso do teste de digitação"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full bg-[#9caeb0] transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
        <AnimatePresence mode="wait" initial={false}>
          {finished ? (
            <motion.div
              key="typing-result"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.42 }}
              className="grid min-w-0 flex-1 gap-5 border-l-2 border-[#9caeb0] pl-4 sm:grid-cols-[minmax(7rem,0.5fr)_1fr] sm:items-end sm:gap-8"
            >
              <div>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Ritmo final
                </span>
                <strong className="mt-1 block font-mono text-5xl font-medium leading-none tracking-[-0.06em] tabular-nums text-[var(--text-primary)] sm:text-6xl">
                  {wordsPerMinute}
                  <span className="ml-2 text-xs font-normal tracking-normal text-[var(--text-secondary)]">
                    WPM
                  </span>
                </strong>
              </div>
              <div className="grid grid-cols-3 gap-x-5 gap-y-3 text-xs text-[var(--text-secondary)]">
                <Metric label="Precisão" value={`${accuracy}%`} />
                <Metric label="Erros" value={String(errors)} />
                <Metric label="Tempo" value={`${elapsed.toFixed(1)} s`} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="typing-metrics"
              initial={false}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-[var(--text-secondary)] sm:grid-cols-4 sm:gap-x-8"
            >
              <Metric label="Ritmo" value={`${wordsPerMinute} WPM`} />
              <Metric label="Precisão" value={`${accuracy}%`} />
              <Metric label="Erros" value={String(errors)} />
              <Metric label="Tempo" value={`${elapsed.toFixed(1)} s`} />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={reset}
          className="focus-state min-h-11 border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
        >
          {finished ? "Tentar novamente" : "Reiniciar"}
        </button>
      </div>
      <AnimatePresence>
        {finished && (
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.34 }}
            className="mt-5 text-sm text-[var(--text-secondary)]"
            role="status"
          >
            Trecho concluído em {elapsed.toFixed(1)} segundos, com {accuracy}% de precisão.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </span>
      <strong className="mt-1 block font-mono text-sm font-medium tabular-nums text-[var(--text-primary)]">
        {value}
      </strong>
    </p>
  );
}
