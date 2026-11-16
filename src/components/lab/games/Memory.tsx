import { useEffect, useRef, useState } from "react";
import { useAchievements } from "../../../lib/achievements";
import { useAudio } from "../../../lib/audio";

const symbols = ["◒", "◉", "◇", "△", "□", "⌁", "⊙", "∿"];

function shuffledCards() {
  const cards = [...symbols, ...symbols]
    .map((symbol, id) => ({ symbol, id, pair: symbol }))
    .sort(() => Math.random() - 0.5);
  return cards;
}

export function Memory() {
  const { recordBestScore, unlock } = useAchievements();
  const { play } = useAudio();
  const [cards, setCards] = useState(shuffledCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [mismatchCards, setMismatchCards] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const complete = matched.length === symbols.length;

  useEffect(() => {
    if (!complete) return;
    unlock("memory-master");
    recordBestScore("memory", Math.max(1, 1000 - moves));
  }, [complete, moves, recordBestScore, unlock]);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const chooseCard = (index: number) => {
    if (selected.length === 2 || selected.includes(index) || matched.includes(cards[index].pair)) {
      return;
    }
    const nextSelected = [...selected, index];
    setSelected(nextSelected);
    play("card");
    if (nextSelected.length !== 2) return;

    setMoves((value) => value + 1);
    const [first, second] = nextSelected;
    if (cards[first].pair === cards[second].pair) {
      play("success");
      setMatched((value) => [...value, cards[first].pair]);
      setSelected([]);
      setMismatchCards([]);
      return;
    }

    play("error");
    setMismatchCards(nextSelected);
    timeoutRef.current = window.setTimeout(() => {
      setSelected([]);
      setMismatchCards([]);
      timeoutRef.current = null;
    }, 700);
  };

  const restart = () => {
    play("game-start");
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setCards(shuffledCards());
    setSelected([]);
    setMismatchCards([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div className="mx-auto max-w-md">
      <p className="mb-4 border-l-2 border-[#899eaa] bg-[#899eaa]/[0.06] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">
        <strong className="mr-2 font-medium text-[var(--text-primary)]">Como jogar</strong>
        Vire duas cartas por vez. No celular, toque nas cartas para encontrar os pares.
      </p>
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span>Tentativas <strong className="ml-1 text-[var(--text-primary)]">{moves}</strong></span>
        <span key={complete ? "complete" : "playing"} className={complete ? "game-score-pop" : ""} aria-live="polite">{complete ? "Todos os pares encontrados" : `${matched.length} / ${symbols.length} pares`}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Cartas do jogo da memória">
        {cards.map((card, index) => {
          const revealed = selected.includes(index) || matched.includes(card.pair);
          const isMatched = matched.includes(card.pair);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => chooseCard(index)}
              disabled={revealed || complete}
              aria-label={revealed ? `Carta ${card.pair}${matched.includes(card.pair) ? ", par encontrado" : ""}` : `Revelar carta ${index + 1}`}
              aria-pressed={revealed}
              className={`memory-card focus-state aspect-square border text-2xl transition-[transform,background-color,border-color,color] duration-200 active:scale-[0.97] sm:text-3xl ${
                revealed
                  ? "border-[var(--border-strong)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--accent-muted)]"
              } ${mismatchCards.includes(index) ? "memory-card-mismatch" : ""} ${isMatched ? "memory-card-match" : ""}`}
            >
              <span className={`memory-card-inner ${revealed ? "memory-card-inner--revealed" : ""}`}>
                <span className="memory-card-face memory-card-face--back">·</span>
                <span className="memory-card-face memory-card-face--front">{card.symbol}</span>
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={restart}
        className="focus-state mt-5 min-h-11 border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
      >
        {complete ? "Jogar novamente" : "Embaralhar"}
      </button>
    </div>
  );
}
