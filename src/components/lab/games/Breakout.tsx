import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAchievements } from "../../../lib/achievements";
import { useAudio } from "../../../lib/audio";

type Brick = { id: number; x: number; y: number; row: number };
type BreakoutState = {
  ballX: number;
  ballY: number;
  velocityX: number;
  velocityY: number;
  paddleX: number;
  bricks: Brick[];
  score: number;
  lives: number;
  combo: number;
  status: "ready" | "playing" | "over" | "won";
};

const brickColors = ["#c2a36f", "#b9907b", "#899eaa", "#99ab93", "#aa98b5"];

function makeBricks(): Brick[] {
  return Array.from({ length: 40 }, (_, id) => ({
    id,
    x: 3 + (id % 8) * 12,
    y: 10 + Math.floor(id / 8) * 9,
    row: Math.floor(id / 8),
  }));
}

function initialGame(): BreakoutState {
  return {
    ballX: 50,
    ballY: 78,
    velocityX: 0.75,
    velocityY: -0.8,
    paddleX: 50,
    bricks: makeBricks(),
    score: 0,
    lives: 3,
    combo: 0,
    status: "ready",
  };
}

function clampPaddle(value: number) {
  return Math.max(12, Math.min(88, value));
}

export function Breakout() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { recordBestScore } = useAchievements();
  const { play } = useAudio();
  const [game, setGame] = useState(initialGame);
  const gameRef = useRef(game);
  gameRef.current = game;

  const update = (transform: (current: BreakoutState) => BreakoutState) => {
    const next = transform(gameRef.current);
    gameRef.current = next;
    setGame(next);
  };

  const movePaddle = (amount: number) =>
    update((current) => ({
      ...current,
      paddleX: clampPaddle(current.paddleX + amount),
    }));

  const movePaddleToPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      game.status !== "playing" ||
      (event.pointerType !== "touch" && event.buttons === 0)
    ) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    update((current) => ({
      ...current,
      paddleX: clampPaddle(((event.clientX - bounds.left) / bounds.width) * 100),
    }));
  };

  useEffect(() => {
    if (game.status !== "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!["arrowleft", "arrowright", "a", "d"].includes(key)) return;
      event.preventDefault();
      movePaddle(key === "arrowleft" || key === "a" ? -7 : 7);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.status]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const timer = window.setInterval(() => {
      update((current) => {
        let x = current.ballX + current.velocityX;
        let y = current.ballY + current.velocityY;
        let vx = current.velocityX;
        let vy = current.velocityY;
        let lives = current.lives;
        let score = current.score;
        let combo = current.combo;
        let bricks = current.bricks;
        let status = current.status;

        if (x < 1 || x > 99) {
          vx *= -1;
          x = Math.max(1, Math.min(99, x));
          play("wall");
        }
        if (y < 1) {
          vy = Math.abs(vy);
          y = 1;
        }
        if (
          vy > 0 &&
          y >= 89 &&
          y <= 96 &&
          Math.abs(x - current.paddleX) <= 13
        ) {
          const impact = (x - current.paddleX) / 13;
          y = 89;
          vy = -Math.min(1.2, Math.abs(vy) * 1.025);
          vx = Math.max(-1.25, Math.min(1.25, vx + impact * 0.12));
          play("hit");
        }

        const hitIndex = bricks.findIndex(
          (brick) =>
            x >= brick.x - 1 &&
            x <= brick.x + 11 &&
            y >= brick.y - 1 &&
            y <= brick.y + 5,
        );
        if (hitIndex !== -1) {
          bricks = bricks.filter((_, index) => index !== hitIndex);
          combo += 1;
          score += 10 + Math.min(combo - 1, 8) * 2;
          vy *= -1;
          play("block");
          if (bricks.length === 0) status = "won";
        }

        if (y > 102) {
          lives -= 1;
          play("life");
          combo = 0;
          x = 50;
          y = 78;
          vx = 0.75;
          vy = -0.8;
          if (lives === 0) status = "over";
        }

        return {
          ...current,
          ballX: x,
          ballY: y,
          velocityX: vx,
          velocityY: vy,
          lives,
          score,
          combo,
          bricks,
          status,
        };
      });
    }, 28);
    return () => window.clearInterval(timer);
  }, [game.status]);

  const start = () => {
    play("game-start");
    const next = { ...initialGame(), status: "playing" as const };
    gameRef.current = next;
    setGame(next);
  };

  useEffect(() => {
    if (game.status === "over" || game.status === "won") {
      recordBestScore("breakout", game.score);
    }
  }, [game.score, game.status, recordBestScore]);

  const statusLabel =
    game.status === "won"
      ? "Arena limpa"
      : game.status === "over"
        ? "Fim de jogo"
        : game.status === "ready"
          ? "Pronto"
          : "Em andamento";

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 border-l-2 border-[#c2a36f] bg-[#c2a36f]/[0.06] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">
        <strong className="mr-2 font-medium text-[var(--text-primary)]">Como jogar</strong>
        Use ← → ou A/D no computador. No celular, toque e arraste o paddle para rebater a bola.
      </p>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--text-secondary)]" aria-live="polite">
        <span>Pontos <strong className="ml-1 font-mono tabular-nums text-[var(--text-primary)]">{game.score}</strong></span>
        <span>Sequência <strong className="ml-1 font-mono tabular-nums text-[var(--text-primary)]">{game.combo}×</strong></span>
        <span className="flex items-center gap-1.5" aria-label={`${game.lives} vidas restantes`}>
          {Array.from({ length: 3 }, (_, index) => (
            <i key={index} className={`h-1.5 w-1.5 rounded-full ${index < game.lives ? "bg-[#d2a77f]" : "bg-[var(--text-muted)]/35"}`} />
          ))}
        </span>
      </div>
      <div
        role="img"
        aria-label={`Breakout. Pontuação ${game.score}; ${game.lives} vidas restantes; ${game.bricks.length} blocos. ${statusLabel}.`}
        onPointerDown={movePaddleToPointer}
        onPointerMove={movePaddleToPointer}
        className="relative aspect-[3/2] touch-none overflow-hidden border border-[var(--border-strong)] bg-[#171b1c] [background-image:linear-gradient(rgb(255_255_255_/_4%)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255_/_4%)_1px,transparent_1px),radial-gradient(ellipse_at_50%_100%,rgb(194_163_111_/_8%),transparent_52%)] [background-size:2rem_2rem,2rem_2rem,auto]"
      >
        <AnimatePresence initial={false}>
          {game.bricks.map((brick) => (
            <motion.span
              key={brick.id}
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.55, filter: "brightness(1.8)" }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.18 }}
              className="breakout-brick absolute h-[4.5%] w-[10%] border border-white/20 shadow-[inset_0_1px_rgb(255_255_255_/_28%),0_2px_8px_rgb(0_0_0_/_15%)]"
              style={{
                left: `${brick.x}%`,
                top: `${brick.y}%`,
                background: `linear-gradient(135deg, ${brickColors[brick.row]}, ${brickColors[brick.row]}aa)`,
              }}
            />
          ))}
        </AnimatePresence>
        {game.score > 0 && (
          <span
            key={game.score}
            aria-hidden="true"
            className="breakout-impact-flash pointer-events-none absolute inset-0"
          />
        )}
        <span
          className="breakout-ball absolute h-[2.5%] w-[2%] rounded-full bg-[#f0d8a8] shadow-[0_0_14px_4px_rgb(240_216_168_/_44%)]"
          style={{ left: `${game.ballX}%`, top: `${game.ballY}%`, transform: "translate(-50%, -50%)" }}
        />
        <span
          className="breakout-paddle absolute bottom-[5%] h-[2.5%] w-[24%] rounded-sm bg-[#bdab96] shadow-[0_0_12px_rgb(189_171_150_/_28%)] transition-[left] duration-75"
          style={{ left: `${game.paddleX}%`, transform: "translateX(-50%)" }}
        />
        {game.combo > 1 && game.status === "playing" && (
          <span key={game.combo} className="game-score-pop absolute right-4 top-4 text-[10px] font-medium uppercase tracking-[0.15em] text-[#e0bd8e]">
            Combo ×{game.combo}
          </span>
        )}
        {game.status !== "playing" && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
            {statusLabel}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={start}
          className="focus-state min-h-11 border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
        >
          {game.status === "ready" ? "Começar" : game.status === "playing" ? "Reiniciar" : "Jogar novamente"}
        </button>
        <div className="flex gap-2" role="group" aria-label="Controles do paddle">
          <button type="button" onClick={() => movePaddle(-10)} aria-label="Mover paddle para esquerda" disabled={game.status !== "playing"} className="focus-state min-h-11 min-w-11 border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40">←</button>
          <button type="button" onClick={() => movePaddle(10)} aria-label="Mover paddle para direita" disabled={game.status !== "playing"} className="focus-state min-h-11 min-w-11 border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40">→</button>
        </div>
      </div>
    </div>
  );
}
