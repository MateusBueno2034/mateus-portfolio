import { useEffect } from "react";

export function AtmosphericLight() {
  useEffect(() => {
    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let frame = 0;
    let latestX = 0;
    let latestY = 0;

    const clearLight = () => {
      cancelAnimationFrame(frame);
      root.style.removeProperty("--light-x");
      root.style.removeProperty("--light-y");
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || frame) return;
      latestX = event.clientX;
      latestY = event.clientY;
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--light-x", `${latestX}px`);
        root.style.setProperty("--light-y", `${latestY}px`);
        frame = 0;
      });
    };

    const updateAvailability = () => {
      clearLight();
      if (pointerQuery.matches && !motionQuery.matches) {
        window.addEventListener("pointermove", move, { passive: true });
      } else {
        window.removeEventListener("pointermove", move);
      }
    };
    updateAvailability();
    pointerQuery.addEventListener("change", updateAvailability);
    motionQuery.addEventListener("change", updateAvailability);
    return () => {
      window.removeEventListener("pointermove", move);
      pointerQuery.removeEventListener("change", updateAvailability);
      motionQuery.removeEventListener("change", updateAvailability);
      clearLight();
    };
  }, []);

  return <div aria-hidden="true" className="portfolio-atmospheric-light" />;
}
