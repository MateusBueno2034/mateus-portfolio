import { useCallback, useEffect, useRef, useState } from "react";
import { useAchievements } from "../../../lib/achievements";
import { useAudio } from "../../../lib/audio";

type Shape = number[][];
type Piece = { shape: Shape; x: number; y: number; type: number };
type Board = number[][];
type Game = {
  board: Board;
  piece: Piece;
  nextPiece: Piece;
  status: "ready" | "playing" | "over";
  score: number;
  lines: number;
  lockCount: number;
};

const width = 10;
const height = 18;
const shapes: Shape[] = [
  [[1, 1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
];
const pieceColors = [
  "#91a9b8",
  "#c0a8ca",
  "#c9a975",
  "#d08f7c",
  "#91b09a",
  "#8fa3ba",
  "#78a9a4",
];

function emptyBoard(): Board {
  return Array.from({ length: height }, () => Array(width).fill(0));
}

function newPiece(): Piece {
  const type = Math.floor(Math.random() * shapes.length);
  return { shape: shapes[type], x: 3, y: 0, type: type + 1 };
}

function newGame(): Game {
  return {
    board: emptyBoard(),
    piece: newPiece(),
    nextPiece: newPiece(),
    status: "ready",
    score: 0,
    lines: 0,
    lockCount: 0,
  };
}

function collides(board: Board, shape: Shape, x: number, y: number) {
  return shape.some((row, rowIndex) =>
    row.some((cell, columnIndex) => {
      if (!cell) return false;
      const nextX = x + columnIndex;
      const nextY = y + rowIndex;
      return (
        nextX < 0 ||
        nextX >= width ||
        nextY >= height ||
        (nextY >= 0 && board[nextY][nextX] !== 0)
      );
    }),
  );
}

function rotated(shape: Shape): Shape {
  return shape[0].map((_, column) =>
    shape.map((row) => row[column]).reverse(),
  );
}

function lockPiece(current: Game, dropBonus = 0): Game {
  const { board, piece } = current;
  const merged = board.map((row) => [...row]);
  piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const targetY = piece.y + rowIndex;
      const targetX = piece.x + columnIndex;
      if (cell && targetY >= 0) merged[targetY][targetX] = piece.type;
    });
  });

  const remaining = merged.filter((row) => row.some((cell) => cell === 0));
  const cleared = height - remaining.length;
  const nextBoard = [
    ...Array.from({ length: cleared }, () => Array(width).fill(0)),
    ...remaining,
  ];
  const nextPiece = current.nextPiece;
  const followingPiece = newPiece();
  const gameOver = collides(
    nextBoard,
    nextPiece.shape,
    nextPiece.x,
    nextPiece.y,
  );
  return {
    ...current,
    board: nextBoard,
    piece: nextPiece,
    nextPiece: followingPiece,
    status: gameOver ? "over" : "playing",
    score: current.score + [0, 100, 300, 500, 800][cleared] + dropBonus,
    lines: current.lines + cleared,
    lockCount: current.lockCount + 1,
  };
}

export function Tetris() {
  const { recordBestScore } = useAchievements();
  const { play } = useAudio();
  const [game, setGame] = useState<Game>(newGame);
  const gameRef = useRef(game);
  gameRef.current = game;

  const commit = (next: Game) => {
    gameRef.current = next;
    setGame(next);
  };

  const move = useCallback((dx: number, dy: number) => {
    const current = gameRef.current;
    if (
      current.status !== "playing" ||
      collides(
        current.board,
        current.piece.shape,
        current.piece.x + dx,
        current.piece.y + dy,
      )
    ) {
      return;
    }
    commit({
      ...current,
      piece: {
        ...current.piece,
        x: current.piece.x + dx,
        y: current.piece.y + dy,
      },
    });
    if (dx !== 0) play("move");
  }, [play]);

  const rotatePiece = useCallback(() => {
    const current = gameRef.current;
    if (current.status !== "playing") return;
    const shape = rotated(current.piece.shape);
    if (!collides(current.board, shape, current.piece.x, current.piece.y)) {
      commit({ ...current, piece: { ...current.piece, shape } });
      play("rotate");
      return;
    }
    for (const offset of [-1, 1, -2, 2]) {
      if (!collides(current.board, shape, current.piece.x + offset, current.piece.y)) {
        commit({
          ...current,
          piece: {
            ...current.piece,
            shape,
            x: current.piece.x + offset,
          },
        });
        play("rotate");
        return;
      }
    }
  }, [play]);

  const tick = useCallback(() => {
    const current = gameRef.current;
    if (current.status !== "playing") return;
    const { board, piece } = current;

    if (!collides(board, piece.shape, piece.x, piece.y + 1)) {
      commit({ ...current, piece: { ...piece, y: piece.y + 1 } });
      return;
    }
    commit(lockPiece(current));
    play("lock");
  }, [play]);

  const hardDrop = useCallback(() => {
    const current = gameRef.current;
    if (current.status !== "playing") return;
    let y = current.piece.y;
    while (
      !collides(
        current.board,
        current.piece.shape,
        current.piece.x,
        y + 1,
      )
    ) {
      y += 1;
    }
    const distance = y - current.piece.y;
    commit(
      lockPiece(
        { ...current, piece: { ...current.piece, y } },
        distance * 2,
      ),
    );
    play("drop");
  }, [play]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const level = Math.floor(game.lines / 10) + 1;
    const timer = window.setInterval(tick, Math.max(140, 520 - (level - 1) * 36));
    return () => window.clearInterval(timer);
  }, [game.lines, game.status, tick]);

  useEffect(() => {
    if (game.status !== "playing") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!["arrowleft", "arrowright", "arrowdown", "arrowup", " ", "x"].includes(key)) return;
      event.preventDefault();
      if (key === "arrowleft") move(-1, 0);
      if (key === "arrowright") move(1, 0);
      if (key === "arrowdown") move(0, 1);
      if (key === "arrowup" || key === "x") rotatePiece();
      if (key === " ") hardDrop();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [game.status, hardDrop, move, rotatePiece]);

  useEffect(() => {
    if (game.status === "over") recordBestScore("tetris", game.score);
  }, [game.score, game.status, recordBestScore]);

  const start = () => {
    play("game-start");
    commit({ ...newGame(), status: "playing" });
  };
  const visibleBoard = game.board.map((row) => [...row]);
  let ghostY = game.piece.y;
  while (
    !collides(
      game.board,
      game.piece.shape,
      game.piece.x,
      ghostY + 1,
    )
  ) {
    ghostY += 1;
  }
  game.piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const y = ghostY + rowIndex;
      const x = game.piece.x + columnIndex;
      if (cell && y >= 0 && y < height && x >= 0 && x < width) {
        if (!visibleBoard[y][x]) visibleBoard[y][x] = -game.piece.type;
      }
    });
  });
  game.piece.shape.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const y = game.piece.y + rowIndex;
      const x = game.piece.x + columnIndex;
      if (cell && y >= 0 && y < height && x >= 0 && x < width) {
        visibleBoard[y][x] = game.piece.type;
      }
    });
  });

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-4 border-l-2 border-[#b4a1c8] bg-[#b4a1c8]/[0.06] px-4 py-3 text-xs leading-5 text-[var(--text-secondary)]">
        <strong className="mr-2 font-medium text-[var(--text-primary)]">Controles</strong>
        ← → mover · ↑ ou X girar · ↓ acelerar · Espaço queda direta. No celular, use os controles abaixo.
      </p>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
      <div
        role="img"
        aria-label={`Tabuleiro Tetris. Pontuação ${game.score}. Linhas completas ${game.lines}. Estado: ${game.status === "over" ? "fim de jogo" : game.status === "playing" ? "em partida" : "pronto"}.`}
        className="tetris-board relative grid aspect-[10/18] grid-cols-10 overflow-hidden border border-white/10 bg-[#171b1c] [background-image:linear-gradient(135deg,rgb(255_255_255_/_3%),transparent_45%)]"
      >
        {visibleBoard.flatMap((row, y) =>
          row.map((cell, x) => (
            <span
              key={`${x}-${y}`}
              className={`tetris-cell border-[0.5px] border-white/[0.035] ${cell > 0 ? "tetris-cell--filled shadow-[inset_0_1px_rgb(255_255_255_/_25%),0_1px_6px_rgb(0_0_0_/_20%)]" : ""}`}
              style={
                cell
                  ? {
                      backgroundColor:
                        cell > 0
                          ? pieceColors[cell - 1]
                          : `${pieceColors[Math.abs(cell) - 1]}55`,
                      borderColor:
                        cell < 0
                          ? `${pieceColors[Math.abs(cell) - 1]}90`
                          : undefined,
                    }
                  : undefined
              }
            />
          )),
        )}
        {game.lockCount > 0 && (
          <span
            key={game.lockCount}
            aria-hidden="true"
            className="tetris-lock-flash pointer-events-none absolute inset-0"
          />
        )}
        {game.lines > 0 && (
          <span
            key={game.lines}
            aria-hidden="true"
            className="tetris-line-sweep pointer-events-none absolute inset-y-0 left-0 w-full origin-left"
          />
        )}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:flex-col sm:items-stretch sm:justify-start">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] sm:flex sm:flex-col sm:gap-3 sm:text-xs" aria-live="polite">
          <span>Pontos <strong className="text-[var(--text-primary)]">{game.score}</strong></span>
          <span>
            Linhas{" "}
            <strong
              key={game.lines}
              className={`text-[var(--text-primary)] ${game.lines > 0 ? "line-clear-feedback inline-block" : ""}`}
            >
              {game.lines}
            </strong>
          </span>
          <span>Nível <strong className="text-[var(--text-primary)]">{Math.floor(game.lines / 10) + 1}</strong></span>
          <span>{game.status === "over" ? "Fim de jogo" : game.status === "playing" ? "Em andamento" : "Pronto"}</span>
        </div>
        <div className="flex items-center gap-2 border-l border-[var(--border)] pl-2 sm:block sm:border-l-0 sm:border-t sm:pl-0 sm:pt-3">
          <p className="hidden text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] sm:mb-2 sm:block">Próxima</p>
          <div className="grid w-8 grid-cols-4 sm:w-16" aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => {
              const x = index % 4;
              const y = Math.floor(index / 4);
              const filled = Boolean(game.nextPiece.shape[y]?.[x]);
              return (
                <span
                  key={index}
                  className="aspect-square border-[0.5px] border-white/[0.035]"
                  style={filled ? { backgroundColor: pieceColors[game.nextPiece.type - 1] } : undefined}
                />
              );
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={start}
          className="focus-state col-span-2 min-h-11 w-fit border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)] sm:col-auto"
        >
          {game.status === "playing" ? "Reiniciar" : game.status === "over" ? "Jogar novamente" : "Começar"}
        </button>
        <div className="col-span-2 grid grid-cols-4 gap-1 sm:hidden" role="group" aria-label="Controles Tetris para toque">
          <Control label="Mover para esquerda" action={() => move(-1, 0)} disabled={game.status !== "playing"}>←</Control>
          <Control label="Girar peça" action={rotatePiece} disabled={game.status !== "playing"}>↻</Control>
          <Control label="Acelerar descida" action={() => move(0, 1)} disabled={game.status !== "playing"}>↓</Control>
          <Control label="Mover para direita" action={() => move(1, 0)} disabled={game.status !== "playing"}>→</Control>
          <span className="col-span-3" />
          <Control label="Queda direta" action={hardDrop} disabled={game.status !== "playing"}>⇊</Control>
        </div>
        <div className="hidden grid-cols-3 gap-1 sm:mt-auto sm:grid" role="group" aria-label="Controles Tetris">
          <span />
          <Control label="Girar peça" action={rotatePiece} disabled={game.status !== "playing"}>↻</Control>
          <span />
          <Control label="Mover para esquerda" action={() => move(-1, 0)} disabled={game.status !== "playing"}>←</Control>
          <Control label="Acelerar descida" action={() => move(0, 1)} disabled={game.status !== "playing"}>↓</Control>
          <Control label="Mover para direita" action={() => move(1, 0)} disabled={game.status !== "playing"}>→</Control>
          <span />
          <Control label="Queda direta" action={hardDrop} disabled={game.status !== "playing"}>⇊</Control>
          <span />
        </div>
      </div>
      </div>
    </div>
  );
}

function Control({
  label,
  action,
  children,
  disabled,
}: {
  label: string;
  action: () => void;
  children: string;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={action}
      disabled={disabled}
      aria-label={label}
      className="focus-state min-h-10 min-w-10 border border-[var(--border)] text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] disabled:opacity-40"
    >
      {children}
    </button>
  );
}
