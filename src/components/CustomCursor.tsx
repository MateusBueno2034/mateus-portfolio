import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateAvailability = () =>
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    updateAvailability();
    pointerQuery.addEventListener("change", updateAvailability);
    motionQuery.addEventListener("change", updateAvailability);
    return () => {
      pointerQuery.removeEventListener("change", updateAvailability);
      motionQuery.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      delete document.documentElement.dataset.cursorVisible;
      delete document.documentElement.dataset.cursorInteractive;
      delete document.documentElement.dataset.cursorNative;
      delete document.documentElement.dataset.cursorMode;
      return;
    }

    const root = document.documentElement;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty("--cursor-x", `${pointerX}px`);
        root.style.setProperty("--cursor-y", `${pointerY}px`);
        frame = 0;
      });
      root.dataset.cursorVisible = "true";
    };
    const updateInteractive = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const nativeControl = target.closest(
        "input, textarea, select, [contenteditable='true']",
      );
      const link = target.closest("a");
      const button = target.closest(
        "button, summary, [role='button']",
      );
      root.dataset.cursorNative = nativeControl ? "true" : "false";
      root.dataset.cursorMode = link
        ? "link"
        : button
          ? "button"
          : "default";
      const interactive = link || button;
      root.dataset.cursorInteractive = interactive ? "true" : "false";
    };
    const leave = () => {
      delete root.dataset.cursorVisible;
      delete root.dataset.cursorNative;
      delete root.dataset.cursorMode;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", updateInteractive, true);
    document.addEventListener("pointerout", updateInteractive, true);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", updateInteractive, true);
      document.removeEventListener("pointerout", updateInteractive, true);
      document.removeEventListener("pointerleave", leave);
      window.cancelAnimationFrame(frame);
      delete root.dataset.cursorVisible;
      delete root.dataset.cursorInteractive;
      delete root.dataset.cursorNative;
      delete root.dataset.cursorMode;
      root.style.removeProperty("--cursor-x");
      root.style.removeProperty("--cursor-y");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      data-custom-cursor
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[110] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--text-secondary)] opacity-0 transition-[width,height,background-color,border-color,opacity] duration-150"
      style={{
        transform:
          "translate3d(var(--cursor-x, -100px), var(--cursor-y, -100px), 0) translate(-50%, -50%)",
      }}
    >
      <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--text-primary)]" />
    </div>
  );
}
