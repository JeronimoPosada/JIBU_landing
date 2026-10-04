import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

const steps = [
  ["Día 1—3", "Diagnóstico operativo gratuito", "Observamos el flujo crítico, cuantificamos la fuga y definimos una primera prueba con tus datos."],
  ["Día 4—14", "Integración y despliegue", "Conectamos las fuentes necesarias, validamos el sistema con tu equipo y lo ponemos en operación."],
  ["Después", "Optimización medible", "Mejoramos el sistema con métricas de éxito acordadas por escrito desde el inicio."],
] as const;

export function Method() {
  const timeline = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timeline, offset: ["start 0.8", "end 0.55"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 24 });
  return (
    <section id="proceso" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="px-5 py-20 md:px-10 md:py-28 lg:border-r lg:border-line">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Proceso</p>
            <h2 className="mt-5 font-display text-4xl leading-tight tracking-normal md:text-6xl">De la fuga visible al <em className="font-editorial font-normal text-flow">sistema operando.</em></h2>
            <p className="mt-7 max-w-md leading-7 text-muted-foreground">Empezamos con evidencia, desplegamos rápido y medimos con criterios claros.</p>
          </div>
        </div>
        <div ref={timeline} className="relative px-5 py-16 md:px-10 md:py-24">
          <div className="absolute bottom-24 left-[2.35rem] top-24 w-px bg-line md:left-[3.6rem]" aria-hidden="true"><motion.div className="h-full origin-top bg-flow" style={{ scaleY }} /></div>
          <ol className="relative space-y-16 md:space-y-24">
            {steps.map(([period, title, text], index) => (
              <motion.li key={period} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.5, delay: index * 0.06 }} className="grid grid-cols-[36px_1fr] gap-5 md:grid-cols-[48px_150px_1fr] md:gap-7">
                <span className="relative z-10 mt-1 flex size-8 items-center justify-center rounded-full border border-flow bg-background font-mono text-[10px] text-flow md:size-10">0{index + 1}</span>
                <p className="pt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-flow">{period}</p>
                <div className="col-start-2 md:col-start-3"><h3 className="text-2xl font-medium text-foreground">{title}</h3><p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{text}</p></div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}