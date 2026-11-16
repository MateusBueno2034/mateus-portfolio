import { useEffect, useRef, useState } from "react";
import { useAchievements } from "../../../lib/achievements";
import { useAudio } from "../../../lib/audio";

type PongState = {
  player: number;
  opponent: number;
  ballX: number;
  ballY: number;
  impacts: number;
  velocityX: number;
  velocityY: number;
  playerScore: number;
  opponentScore: number;
  serveDelay: number;
  status: "ready" | "playing" | "won" | "over";
};

const paddleHeight = 26;
const initialState = (): PongState => ({
  player: 37,
  opponent: 37,
  ballX: 50,
  ballY: 50,
  impacts: 0,
  velocityX: 1.2,
  velocityY: 0.62,
  playerScore: 0,
  opponentScore: 0,
  serveDelay: 0,
  status: "ready",
});

function clampPaddle(value: number) {
  return Math.max(0, Math.min(100 - paddleHeight, value));
}

function predictBallY(game: PongState) {
  if (game.velocityX <= 0) return 50;
  const time = (93 - game.ballX) / game.velocityX;
  const projected = game.ballY + game.velocityY * time;
  const range = 96;
  const reflected = ((projected - 2) % (range * 2) + range * 2) % (range * 2);
  return reflected <= range ? 2 + reflected : 2 + range * 2 - reflected;
}

export function Pong() {
  const { recordBestScore } = useAchievements();
  const { play } = useAudio();
  const [game, setGame] = useState(initialState);
  const gameRef = useRef(game);
  gameRef.current = game;
  const aiTarget = useRef(37);
  const arenaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLSpanElement>(null);
  const opponentRef = useRef<HTMLSpanElement>(null);
  const ballRef = useRef<HTMLSpanElement>(null);

  const renderFrame = (current: PongState) => {
    playerRef.current?.style.setProperty("top", `${current.player}%`);
    opponentRef.current?.style.setProperty("top", `${current.opponent}%`);
    ballRef.current?.style.setProperty("left", `${current.ballX}%`);
    ballRef.current?.style.setProperty("top", `${current.ballY}%`);
  };

  const update = (transform: (current: PongState) => PongState) => {
    const next = transform(gameRef.current);
    gameRef.current = next;
    setGame(next);
  };

  const setPlayerTop = (top: number) =>
    update((current) => ({ ...current, player: clampPaddle(top) }));

  const movePlayer = (amount: number) =>
    update((current) => ({
      ...current,
      player: clampPaddle(current.player + amount),
    }));

  useEffect(() => {
    if (game.status !== "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!["w", "s", "arrowup", "arrowdown"].includes(key)) return;
      event.preventDefault();
      movePlayer(key === "w" || key === "arrowup" ? -7 : 7);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.status]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const reactionTimer = window.setInterval(() => {
      const current = gameRef.current;
      const prediction = predictBallY(current);
      aiTarget.current = clampPaddle(
        current.opponent +
          (prediction - paddleHeight / 2 - current.opponent) * 0.4 +
          (Math.random() - 0.5) * 26,
      );
    }, 320);
    return () => window.clearInterval(reactionTimer);
  }, [game.status]);

  useEffect(() => {
    if (game.status !== "playing") return;
    let frame = 0;
    let last = performance.now();
    let accumulator = 0;
    const fixedStep = 1 / 60;
    const step = () => {
      const now = performance.now();
      accumulator = Math.min(accumulator + (now - last) / 1000, 0.1);
      last = now;
      while (accumulator >= fixedStep) {
        const current = gameRef.current;
        if (current.serveDelay > 0) {
          const next = { ...current, serveDelay: Math.max(0, current.serveDelay - 0.5) };
          gameRef.current = next;
          renderFrame(next);
          if (next.serveDelay === 0) setGame(next);
          accumulator -= fixedStep;
          continue;
        }
        const next = (() => {
        const simulationScale = 0.5;
        let x = current.ballX + current.velocityX * simulationScale;
        let y = current.ballY + current.velocityY * simulationScale;
        let impacts = current.impacts;
        let vx = current.velocityX;
        let vy = current.velocityY;
        let playerScore = current.playerScore;
        let opponentScore = current.opponentScore;
        let serveDelay = 0;
        let status = current.status;

        if (y < 2 || y > 98) {
          y = Math.max(2, Math.min(98, y));
          vy *= -1;
          impacts += 1;
          play("wall");
        }
        if (
          vx < 0 &&
          x <= 6 &&
          y >= current.player - 2 &&
          y <= current.player + paddleHeight + 2
        ) {
          const impact = (y - (current.player + paddleHeight / 2)) / (paddleHeight / 2);
          x = 6;
          vx = Math.min(2.4, Math.abs(vx) * 1.035);
          vy = Math.max(-1.7, Math.min(1.7, vy + impact * 0.48));
          impacts += 1;
          play("hit");
        } else if (
          vx > 0 &&
          x >= 94 &&
          y >= current.opponent - 2 &&
          y <= current.opponent + paddleHeight + 2
        ) {
          const impact =
            (y - (current.opponent + paddleHeight / 2)) / (paddleHeight / 2);
          x = 94;
          vx = -Math.min(2.35, Math.abs(vx) * 1.025);
          vy = Math.max(-1.55, Math.min(1.55, vy + impact * 0.36));
          impacts += 1;
          play("hit");
        }

        if (x < 0 || x > 100) {
          const scoredRight = x > 100;
          if (scoredRight) playerScore += 1;
          else opponentScore += 1;
          play("point");
          x = 50;
          y = 50;
          impacts += 1;
          vx = scoredRight ? 1.15 : -1.15;
          vy = Math.random() > 0.5 ? 0.58 : -0.58;
          serveDelay = 22;
          if (playerScore >= 5) status = "won";
          if (opponentScore >= 5) status = "over";
        }

        const maxCpuStep = 0.55;
        const cpuDelta = aiTarget.current - current.opponent;
        const opponent = clampPaddle(
          current.opponent +
            Math.max(-maxCpuStep, Math.min(maxCpuStep, cpuDelta)) * simulationScale,
        );

        return {
          ...current,
          ballX: x,
          ballY: y,
          impacts,
          velocityX: vx,
          velocityY: vy,
          opponent,
          playerScore,
          opponentScore,
          serveDelay,
          status,
        };
        })();
        gameRef.current = next;
        renderFrame(next);
        if (
          next.playerScore !== current.playerScore ||
          next.opponentScore !== current.opponentScore ||
          next.status !== current.status ||
          (current.serveDelay > 0 && next.serveDelay === 0)
        ) {
          setGame(next);
        }
        accumulator -= fixedStep;
      }
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [game.status]);

  const start = () => {
    play("game-start");
    const next = { ...initialState(), status: "playing" as const, serveDelay: 22 };
    aiTarget.current = next.opponent;
    gameRef.current = next;
    setGame(next);
  };

  useEffect(() => {
    if (game.status === "over" || game.status === "won") {
      recordBestScore("pong", game.playerScore);
    }
  }, [game.opponentScore, game.playerScore, game.status, recordBestScore]);

  const moveByPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      game.status !== "playing" ||
      (event.pointerType !== "touch" && event.buttons === 0)
    ) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPlayerTop(relativeY - paddleHeight / 2);
  };

  const statusLabel =
    game.status === "won"
      ? "Você venceu"
      : game.status === "over"
        ? "CPU venceu"
        : game.status === "ready"
          ? "Pronto para sacar"
          : game.serveDelay > 0
            ? "Novo ponto · saque em instantes"
            : "Primeiro a 5 pontos";

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 border-l-2 border-[#cb8b79] bg-[#cb8b79]/[0.06] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">
        <strong className="mr-2 font-medium text-[var(--text-primary)]">Como jogar</strong>
        W/S ou setas no computador. No celular, arraste o paddle esquerdo para acompanhar a bola.
      </p>
      <div className="mb-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span>VOCÊ <strong key={game.playerScore} className={`ml-1 inline-block font-mono text-base tabular-nums text-[var(--text-primary)] ${game.playerScore ? "game-score-pop" : ""}`}>{game.playerScore}</strong></span>
        <span className="text-center text-[10px] uppercase tracking-[0.14em]" aria-live="polite">{statusLabel}</span>
        <span>CPU <strong key={game.opponentScore} className={`ml-1 inline-block font-mono text-base tabular-nums text-[var(--text-primary)] ${game.opponentScore ? "game-score-pop" : ""}`}>{game.opponentScore}</strong></span>
      </div>
      <div
        role="img"
        aria-label={`Pong. Você ${game.playerScore}, CPU ${game.opponentScore}. ${statusLabel}.`}
        onPointerDown={moveByPointer}
        onPointerMove={moveByPointer}
        ref={arenaRef}
        className="relative aspect-[3/2] touch-none overflow-hidden border border-white/10 bg-[#171b1c] [background-image:radial-gradient(circle_at_1px_1px,rgb(255_255_255_/_7%)_1px,transparent_0)] [background-size:1.5rem_1.5rem]"
      >
        <span className="absolute inset-y-[7%] left-1/2 border-l border-dashed border-white/15" />
        <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
        <span
          ref={playerRef}
          className="pong-paddle absolute left-[2%] w-[1.5%] rounded-sm bg-[#a6bba8] shadow-[0_0_12px_rgb(166_187_168_/_42%)]"
          style={{ top: `${game.player}%`, height: `${paddleHeight}%` }}
        />
        <span
          ref={opponentRef}
          className="pong-paddle absolute right-[2%] w-[1.5%] rounded-sm bg-[#bdab96] shadow-[0_0_10px_rgb(189_171_150_/_30%)]"
          style={{ top: `${game.opponent}%`, height: `${paddleHeight}%` }}
        />
        {game.impacts > 0 && (
          <span
            key={game.impacts}
            aria-hidden="true"
            className="pong-impact-flash pointer-events-none absolute inset-0"
          />
        )}
        <span
          ref={ballRef}
          className="pong-ball absolute h-[2.4%] w-[1.6%] rounded-full bg-[#ece2cd] shadow-[0_0_16px_4px_rgb(236_226_205_/_45%)]"
          style={{ left: `${game.ballX}%`, top: `${game.ballY}%`, transform: "translate(-50%, -50%)" }}
        />
        {game.status === "playing" && game.serveDelay > 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 text-[10px] uppercase tracking-[0.2em] text-white/70">
            Saque
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={start}
          className="focus-state min-h-11 border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
        >
          {game.status === "playing" ? "Reiniciar partida" : "Começar partida"}
        </button>
        <div className="flex gap-2" role="group" aria-label="Controles de movimento do paddle">
          <button
            type="button"
            onClick={() => movePlayer(-9)}
            aria-label="Mover paddle para cima"
            disabled={game.status !== "playing"}
            className="focus-state min-h-11 min-w-11 border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => movePlayer(9)}
            aria-label="Mover paddle para baixo"
            disabled={game.status !== "playing"}
            className="focus-state min-h-11 min-w-11 border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-40"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
