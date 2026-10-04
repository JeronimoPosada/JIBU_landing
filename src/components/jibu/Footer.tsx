import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef } from "react";

const links = [
  ["Política de Privacidad", "/privacidad"],
  ["Términos y Condiciones", "/terminos"],
  ["Seguridad (Habeas Data)", "/seguridad"],
  ["LinkedIn", "https://www.linkedin.com/company/jibu-co"],
  ["GitHub", "https://github.com/jibu-studio"],
  ["Instagram", "https://www.instagram.com/jibu.co/"],
] as const;

function ReactiveLetter({ letter, index, pointer, reduced }: { letter: string; index: number; pointer: React.MutableRefObject<{ x: number; y: number }>; reduced: boolean | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 260, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 260, damping: 22 });

  const react = (target: HTMLSpanElement) => {
    if (reduced) return;
    const box = target.getBoundingClientRect();
    const dx = pointer.current.x - (box.left + box.width / 2);
    const dy = pointer.current.y - (box.top + box.height / 2);
    const distance = Math.hypot(dx, dy);
    if (distance < 190) {
      const force = (190 - distance) / 190;
      x.set((-dx / Math.max(distance, 1)) * force * 14);
      y.set((-dy / Math.max(distance, 1)) * force * 14);
    } else {
      x.set(0); y.set(0);
    }
  };

  return <motion.span aria-hidden="true" data-letter={index} onPointerMove={(event) => react(event.currentTarget)} style={{ x: smoothX, y: smoothY }} className="inline-block">{letter}</motion.span>;
}

export function Footer() {
  const pointer = useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();
  return (
    <footer className="overflow-hidden border-t border-line bg-background" onPointerMove={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; }}>
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-16 md:px-10 md:pt-24">
        <p className="sr-only">JIBU</p>
        <div className="flex justify-between font-display text-[clamp(6rem,27vw,25rem)] leading-[0.72] text-foreground" aria-hidden="true">
          {"JIBU".split("").map((letter, index) => <ReactiveLetter key={letter} letter={letter} index={index} pointer={pointer} reduced={reduced} />)}
        </div>
        <div className="mt-14 grid gap-8 border-t border-line pt-7 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"><span className="size-2 animate-pulse rounded-full bg-flow" aria-hidden="true" />Todos los sistemas operativos</p>
            <p className="mt-3 text-xs text-muted-foreground">Medellín · Colombia / LATAM</p>
          </div>
          <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
            {links.map(([label, href]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{label}</a>)}
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">© JIBU</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}