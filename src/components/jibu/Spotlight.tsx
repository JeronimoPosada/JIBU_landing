import { useEffect, useRef, useState } from "react";

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        ref.current?.style.setProperty("--spot-x", `${e.clientX}px`);
        ref.current?.style.setProperty("--spot-y", `${e.clientY}px`);
        ref.current?.style.setProperty("opacity", "1");
      });
    };
    const leave = () => ref.current?.style.setProperty("opacity", "0");
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={ref} aria-hidden="true" className="spotlight-grid pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300" />;
}
