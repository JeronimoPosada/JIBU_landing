import { motion, useInView, useReducedMotion } from "framer-motion";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useRef } from "react";

const metrics = [
  { value: "< 1 s", label: "Latencia de verificación" },
  { value: "WebSockets", label: "Canal en tiempo real" },
  { value: "RLS por cliente", label: "Aislamiento de datos" },
  { value: "E2E", label: "Cifrado de extremo a extremo" },
];

const stack = ["Python", "FastAPI", "PostgreSQL", "Supabase", "OpenAI", "Claude", "WebSockets"];

export function TechnicalEvidence() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const repeatedStack = [...stack, ...stack];

  return (
    <section ref={sectionRef} id="evidencia" aria-labelledby="evidencia-title" className="scroll-mt-16 overflow-hidden border-b border-line bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-20">
        <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow"><span className="signal-dot" /> Evidencia técnica</p>
            <h2 id="evidencia-title" className="mt-4 max-w-2xl font-display text-3xl leading-tight tracking-normal text-foreground md:text-5xl">
              La arquitectura también <em className="font-editorial font-normal text-flow">rinde cuentas.</em>
            </h2>
          </div>
          <p className="max-w-sm font-mono text-xs leading-6 text-muted-foreground">Construido por 3 ingenieros.<br /><span className="text-foreground">Sin intermediarios.</span></p>
        </div>

        <div className="grid border-b border-line sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: reduced ? 0 : index * 0.08, duration: 0.35 }}
              className="border-line py-7 sm:odd:border-r sm:pr-6 sm:even:pl-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-3">{metric.label}</p>
              <p className="font-mono text-xl text-flow md:text-2xl">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative -mx-5 overflow-hidden border-b border-line py-4 md:-mx-10" aria-label={`Tecnologías: ${stack.join(", ")}`}>
          <motion.div
            aria-hidden="true"
            className="flex w-max items-center"
            animate={!reduced && inView ? { x: ["0%", "-50%"] } : { x: "0%" }}
            transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          >
            {repeatedStack.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-6 whitespace-nowrap px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground md:px-5">
                {item}<span className="size-1 rounded-full bg-flow" />
              </span>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col gap-4 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-3 font-mono text-[10px] uppercase leading-5 tracking-[0.1em] text-foreground">
            <ShieldCheck className="size-5 text-flow" />
            Diseñado bajo los principios de la Ley 1581 (Habeas Data)
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-subtle"><LockKeyhole className="size-4" /> Arquitectura verificable</div>
        </div>
      </div>
    </section>
  );
}
