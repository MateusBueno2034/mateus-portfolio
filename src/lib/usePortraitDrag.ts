import { useEffect, useRef } from "react";

type PortraitDragOptions = {
  scale?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function usePortraitDrag({ scale = 1.04 }: PortraitDragOptions = {}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const positionStart = useRef({ x: 0, y: 0 });
  const bounds = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const reducedMotion = useRef(false);

  const render = (x: number, y: number, active = dragging.current) => {
    const image = imageRef.current;
    const frame = frameRef.current;
    if (!image || !frame) return;
    position.current = { x, y };
    image.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    const tiltX = reducedMotion.current ? 0 : clamp(-y / 24, -4.5, 4.5);
    const tiltY = reducedMotion.current ? 0 : clamp(x / 24, -4.5, 4.5);
    frame.style.transition = active ? "none" : "transform 480ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 480ms ease";
    frame.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(${active ? 5 : 0}px)`;
    frame.style.boxShadow = active
      ? `${-tiltY * 1.5}px ${tiltX * 1.5}px 30px rgb(199 181 151 / 18%), var(--shadow-elevated)`
      : "var(--shadow-elevated)";
  };

  const measure = () => {
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!viewport || !image || !image.naturalWidth || !image.naturalHeight) return;
    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    const fit = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const renderedWidth = image.naturalWidth * fit * scale;
    const renderedHeight = image.naturalHeight * fit * scale;
    bounds.current = {
      x: Math.max(0, (renderedWidth - width) / 2),
      y: Math.max(0, (renderedHeight - height) / 2),
    };
    image.style.width = `${renderedWidth}px`;
    image.style.height = `${renderedHeight}px`;
    render(
      clamp(position.current.x, -bounds.current.x, bounds.current.x),
      clamp(position.current.y, -bounds.current.y, bounds.current.y),
      false,
    );
  };

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = imageRef.current;
    const resizeObserver = viewportRef.current
      ? new ResizeObserver(measure)
      : null;
    if (viewportRef.current && resizeObserver) resizeObserver.observe(viewportRef.current);
    if (image?.complete) measure();
    else image?.addEventListener("load", measure);
    return () => {
      resizeObserver?.disconnect();
      image?.removeEventListener("load", measure);
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    event.preventDefault();
    dragging.current = true;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    positionStart.current = { ...position.current };
    viewport.setPointerCapture(event.pointerId);
    render(position.current.x, position.current.y, true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const x = clamp(
      positionStart.current.x + event.clientX - pointerStart.current.x,
      -bounds.current.x,
      bounds.current.x,
    );
    const y = clamp(
      positionStart.current.y + event.clientY - pointerStart.current.y,
      -bounds.current.y,
      bounds.current.y,
    );
    render(x, y, true);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    viewportRef.current?.releasePointerCapture(event.pointerId);
    render(position.current.x, position.current.y, false);
  };

  const onDoubleClick = () => {
    render(0, 0, false);
  };

  return {
    viewportRef,
    imageRef,
    frameRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick,
  };
}
