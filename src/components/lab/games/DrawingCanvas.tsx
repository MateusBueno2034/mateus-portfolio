import { useRef, useState } from "react";
import { useAudio } from "../../../lib/audio";

export function DrawingCanvas() {
  const { play } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const strokeColorRef = useRef("#52675c");
  const [brushSize, setBrushSize] = useState(4);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * canvas.width,
      y: ((event.clientY - bounds.top) / bounds.height) * canvas.height,
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const point = getPoint(event);
    const context = canvas?.getContext("2d");
    if (!canvas || !point || !context) return;
    drawingRef.current = true;
    strokeColorRef.current =
      getComputedStyle(canvas).getPropertyValue("--accent").trim() || "#52675c";
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const point = getPoint(event);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !point || !context) return;
    context.lineTo(point.x, point.y);
    context.strokeStyle = strokeColorRef.current;
    context.lineWidth = brushSize * (canvas.width / canvas.clientWidth);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    play("dismiss");
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p id="drawing-instructions" className="mb-3 text-xs leading-5 text-[var(--text-secondary)]">
        Desenhe usando mouse, caneta ou toque. A área é limpa ao fechar o experimento.
      </p>
      <div className="drawing-surface">
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        aria-label="Área de desenho livre"
        aria-describedby="drawing-instructions"
        className="block aspect-[16/9] w-full touch-none border border-[var(--border)] bg-[var(--surface-elevated)]"
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onLostPointerCapture={stopDrawing}
      />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          Espessura
          <input
            type="range"
            min={1}
            max={12}
            value={brushSize}
            onChange={(event) => setBrushSize(Number(event.target.value))}
            aria-label="Espessura do traço"
            className="accent-[var(--text-primary)]"
          />
        </label>
        <button
          type="button"
          onClick={clear}
          className="focus-state min-h-11 border border-[var(--border-strong)] px-4 text-xs text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)]"
        >
          Limpar desenho
        </button>
      </div>
    </div>
  );
}
