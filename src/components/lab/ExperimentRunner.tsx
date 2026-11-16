import { lazy, Suspense, useEffect } from "react";
import type { ComponentType } from "react";
import type { ExperimentId } from "./experiments";
import { useAchievements } from "../../lib/achievements";
import { experiments } from "./experiments";
import { useAudio } from "../../lib/audio";

const gameComponents: Record<ExperimentId, ComponentType> = {
  snake: lazy(() => import("./games/Snake").then((module) => ({ default: module.Snake }))),
  tetris: lazy(() => import("./games/Tetris").then((module) => ({ default: module.Tetris }))),
  pong: lazy(() => import("./games/Pong").then((module) => ({ default: module.Pong }))),
  breakout: lazy(() => import("./games/Breakout").then((module) => ({ default: module.Breakout }))),
  memory: lazy(() => import("./games/Memory").then((module) => ({ default: module.Memory }))),
  typing: lazy(() => import("./games/TypingTest").then((module) => ({ default: module.TypingTest }))),
  drawing: lazy(() => import("./games/DrawingCanvas").then((module) => ({ default: module.DrawingCanvas }))),
};

export function ExperimentRunner({
  experimentId,
}: {
  experimentId: ExperimentId;
}) {
  const { recordExperiment } = useAchievements();
  const { play } = useAudio();

  useEffect(() => {
    recordExperiment(experimentId, experiments.length);
    play("experiment");
  }, [experimentId, play, recordExperiment]);

  const SelectedExperiment = gameComponents[experimentId];

  return (
    <Suspense
      fallback={
        <p className="py-12 text-center text-sm text-[var(--text-secondary)]" role="status">
          Preparando experimento…
        </p>
      }
    >
      <SelectedExperiment />
    </Suspense>
  );
}
