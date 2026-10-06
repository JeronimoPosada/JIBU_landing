import { useEffect, useRef } from "react";

export function FlowCanvas({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let animation = 0;
    let width = 0;
    let height = 0;
    const styles = getComputedStyle(document.documentElement);
    const flow = styles.getPropertyValue("--color-flow").trim() || "hsl(185, 70%, 48%)";
    const alert = styles.getPropertyValue("--color-alert").trim() || "hsl(0, 72%, 55%)";
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const count = width < 640 ? 7 : 18;
      const anomalyIndex = Math.floor(frame / 300) % count;
      for (let i = 0; i < count; i += 1) {
        const progress = ((frame * 0.0015 + i / count) % 1);
        const x = progress * width;
        const y = height * 0.25 + Math.sin(progress * Math.PI * 2 + i) * height * 0.22 + (i % 3) * height * 0.13;
        const anomaly = i === anomalyIndex && progress > 0.57;
        const interceptedX = anomaly ? Math.min(x, width * 0.72) : x;
        ctx.beginPath();
        ctx.arc(interceptedX, y, anomaly ? 4 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = anomaly ? alert : flow;
        ctx.globalAlpha = anomaly ? 0.95 : 0.14 + progress * 0.45;
        ctx.fill();
        if (anomaly && x >= width * 0.72 && width >= 640) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = alert;
          ctx.font = "500 9px 'JetBrains Mono', monospace";
          ctx.fillText("COMPROBANTE ALTERADO · 0.4 s", width * 0.72 - 78, y - 16);
          ctx.beginPath();
          ctx.strokeStyle = alert;
          ctx.arc(width * 0.72, y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      frame += 1;
      animation = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return <canvas ref={ref} className="absolute inset-0 size-full opacity-70" aria-hidden="true" />;
}