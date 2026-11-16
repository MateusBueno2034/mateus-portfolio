import { useEffect, useRef, useState } from "react";
import { useAchievements } from "../../../lib/achievements";
import { useAudio } from "../../../lib/audio";

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";
type Status = "ready" | "playing" | "over";

const columns = 18;
const rows = 14;
const startSnake: Point[] = [
  { x: 8, y: 7 },
  { x: 7, y: 7 },
  { x: 6, y: 7 },
];

const vectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const directionLabels: Record<Direction, string> = {
  up: "cima",
  down: "baixo",
  left: "esquerda",
  right: "direita",
};

function randomFood(snake: Point[]): Point {
  const available = Array.from({ length: columns * rows }, (_, index) => ({
    x: index % columns,
    y: Math.floor(index / columns),
  })).filter(
    (point) => !snake.some((segment) => segment.x === point.x && segment.y === point.y),
  );
  return available[Math.floor(Math.random() * available.length)] ?? startSnake[0];
}

export function Snake() {
  const { recordBestScore } = useAchievements();
  const { play } = useAudio();
  const [snake, setSnake] = useState(startSnake);
  const snakeRef = useRef(snake);
  const [food, setFood] = useState<Point>(() => randomFood(startSnake));
  const foodRef = useRef(food);
  const [direction, setDirection] = useState<Direction>("right");
  const directionRef = useRef<Direction>("right");
  const touchStart = useRef<Point | null>(null);
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);

  const changeDirection = (next: Direction) => {
    const current = directionRef.current;
    if (
      (current === "up" && next === "down") ||
      (current === "down" && next === "up") ||
      (current === "left" && next === "right") ||
      (current === "right" && next === "left")
    ) {
      return;
    }
    directionRef.current = next;
    setDirection(next);
  };

  useEffect(() => {
    if (status !== "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const keys: Record<string, Direction> = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right",
      };
      const next = keys[event.key.toLowerCase()];
      if (!next) return;
      event.preventDefault();
      changeDirection(next);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      const currentSnake = snakeRef.current;
      const vector = vectors[directionRef.current];
      const nextHead = {
        x: currentSnake[0].x + vector.x,
        y: currentSnake[0].y + vector.y,
      };
      const currentFood = foodRef.current;
      const eating = nextHead.x === currentFood.x && nextHead.y === currentFood.y;
      const collisionBody = eating ? currentSnake : currentSnake.slice(0, -1);
      const hit =
        nextHead.x < 0 ||
        nextHead.x >= columns ||
        nextHead.y < 0 ||
        nextHead.y >= rows ||
        collisionBody.some(
          (segment) => segment.x === nextHead.x && segment.y === nextHead.y,
        );
      if (hit) {
        play("game-over");
        setStatus("over");
        return;
      }

      const nextSnake = [
        nextHead,
        ...(eating ? currentSnake : currentSnake.slice(0, -1)),
      ];
      snakeRef.current = nextSnake;
      setSnake(nextSnake);
      if (eating) {
        play("pair");
        setScore((value) => value + 1);
        const nextFood = randomFood(nextSnake);
        foodRef.current = nextFood;
        setFood(nextFood);
      }
    }, Math.max(85, 145 - score * 3));
    return () => window.clearInterval(timer);
  }, [score, status]);

  useEffect(() => {
    if (status === "over") recordBestScore("snake", score);
  }, [recordBestScore, score, status]);

  const start = () => {
    directionRef.current = "right";
    setDirection("right");
    snakeRef.current = startSnake;
    setSnake(startSnake);
    const nextFood = randomFood(startSnake);
    foodRef.current = nextFood;
    setFood(nextFood);
    setScore(0);
    setStatus("playing");
    play("game-start");
  };

  const handleSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    if (event.type === "pointerdown") {
      touchStart.current = { x: event.clientX, y: event.clientY };
      return;
    }
    const startPoint = touchStart.current;
    touchStart.current = null;
    if (!startPoint) return;
    const dx = event.clientX - startPoint.x;
    const dy = event.clientY - startPoint.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    changeDirection(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up",
    );
  };

  const headEyes: Record<Direction, string> = {
    up: "left-[18%] top-[14%] flex-row",
    down: "bottom-[14%] left-[18%] flex-row",
    left: "left-[14%] top-[18%] flex-col",
    right: "right-[14%] top-[18%] flex-col",
  };

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-4 border-l-2 border-[var(--snake-color)] bg-[var(--snake-color)]/[0.06] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">
        <strong className="mr-2 font-medium text-[var(--text-primary)]">Como jogar</strong>
        Setas ou WASD no computador. No celular, deslize sobre a arena ou use o direcional.
      </p>
      <div className="mb-3 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <span>
          Pontuação           <strong key={score} className={`ml-1 inline-block tabular-nums text-[var(--text-primary)] ${score ? "game-score-pop" : ""}`}>{score}</strong>
        </span>
        <span aria-live="polite">
          {status === "ready" ? "Pronto" : status === "over" ? "Fim de jogo" : `Direção: ${directionLabels[direction]}`}
        </span>
      </div>
      <div
        role="img"
        aria-label={`Arena Snake. Pontuação ${score}. ${status === "over" ? "Fim de jogo." : ""}`}
        onPointerDown={handleSwipe}
        onPointerUp={handleSwipe}
        className="relative aspect-[18/14] touch-none overflow-hidden border border-[var(--border-strong)] bg-[#171b1b] [--snake-color:#9db69a] [--snake-color-soft:#758d76] [background-image:radial-gradient(circle_at_1px_1px,rgb(255_255_255_/_7%)_1px,transparent_0)] [background-size:1.5rem_1.5rem]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 grid grid-cols-[repeat(18,minmax(0,1fr))] grid-rows-[repeat(14,minmax(0,1fr))]"
        >
          {Array.from({ length: columns * rows }, (_, index) => (
            <i key={index} className="border-[0.5px] border-white/[0.025]" />
          ))}
        </span>
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const isTail = index === snake.length - 1;
          return (
            <span
              key={`${segment.x}-${segment.y}`}
              aria-hidden="true"
              className={`snake-segment absolute z-10 flex items-center justify-center ${
                isHead
                  ? `snake-head snake-head--${direction} rounded-[38%] bg-[var(--snake-color)] shadow-[0_0_14px_rgb(157_182_154_/_38%)] ${
                      direction === "up" || direction === "down"
                        ? "h-[calc(100%/14-4px)] w-[calc(100%/18*0.72)]"
                        : "h-[calc(100%/14*0.72)] w-[calc(100%/18-4px)]"
                    }`
                  : `${isTail ? "rounded-full" : "rounded-[34%]"} ${
                      index % 2
                        ? "bg-[var(--snake-color-soft)]"
                        : "bg-[var(--snake-color)]"
                    } shadow-[0_1px_5px_rgb(0_0_0_/_22%)]`
              } ${status === "over" ? "snake-segment-dissolve" : ""}`}
              style={{
                left: `${((segment.x + 0.5) / columns) * 100}%`,
                top: `${((segment.y + 0.5) / rows) * 100}%`,
                width: `calc(100% / ${columns} - 4px)`,
                height: `calc(100% / ${rows} - 4px)`,
                transform: "translate(-50%, -50%)",
                transition: `left ${Math.max(60, 130 - score * 3)}ms linear, top ${Math.max(60, 130 - score * 3)}ms linear`,
                animationDelay:
                  status === "over" ? `${Math.min(index * 6, 120)}ms` : undefined,
              }}
            >
              {isHead && (
                <span className={`absolute flex gap-[18%] ${headEyes[direction]}`}>
                  <i className="h-1 w-1 rounded-full bg-[#202720]" />
                  <i className="h-1 w-1 rounded-full bg-[#202720]" />
                </span>
              )}
            </span>
          );
        })}
        <span
          key={`${food.x}-${food.y}`}
          aria-hidden="true"
          className="snake-food-enter snake-food-orbit absolute z-10 rounded-full bg-[#d5a878] shadow-[0_0_7px_2px_rgb(213_168_120_/_50%)] ring-2 ring-[#d5a878]/20"
          style={{
            left: `${((food.x + 0.5) / columns) * 100}%`,
            top: `${((food.y + 0.5) / rows) * 100}%`,
            width: "3.2%",
            height: "4.1%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-5">
        <button
          type="button"
          onClick={start}
          className="focus-state min-h-11 border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
        >
          {status === "ready" ? "Começar" : status === "playing" ? "Reiniciar" : "Jogar novamente"}
        </button>
        <div className="grid grid-cols-3 gap-1" role="group" aria-label="Direcional Snake">
          {(["up", "left", "down", "right"] as const).map((next) => (
            <button
              key={next}
              type="button"
              onClick={() => changeDirection(next)}
              disabled={status !== "playing"}
              aria-label={`Mover para ${directionLabels[next]}`}
              className={`focus-state min-h-11 min-w-11 border border-[var(--border)] text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40 ${
                next === "up"
                  ? "col-start-2"
                  : next === "left"
                    ? "col-start-1 row-start-2"
                    : next === "down"
                      ? "col-start-2 row-start-2"
                      : "col-start-3 row-start-2"
              }`}
            >
              {next === "up" ? "↑" : next === "down" ? "↓" : next === "left" ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
