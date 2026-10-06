import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrefs } from "@/lib/preferences";
import { FlowCanvas } from "./FlowCanvas";

const events = [
  { text: "Transferencia $85.000 conciliada", time: "0.8 s", amount: 85000, alert: false },
  { text: "Comprobante duplicado bloqueado", time: "0.4 s", amount: 460000, alert: true },
  { text: "Pago de proveedor verificado", time: "0.6 s", amount: 1280000, alert: false },
  { text: "Monto atípico enviado a revisión", time: "0.5 s", amount: 2740000, alert: true },
  { text: "Venta y abono conciliados", time: "0.9 s", amount: 326500, alert: false },
];

export function LedgerHero() {
  const [visible, setVisible] = useState(true);
  const [eventCount, setEventCount] = useState(2);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t, chime } = usePrefs();
  const words = t.hero.title.split(" ");
  const highlight: readonly string[] = t.hero.highlight;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false), { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced) return;
    const timer = window.setInterval(() => setEventCount((count) => (count >= events.length ? 2 : count + 1)), 2400);
    return () => window.clearInterval(timer);
  }, [visible, reduced]);

  useEffect(() => {
    if (eventCount > 2 && !events[eventCount - 1]?.alert) chime();
  }, [eventCount, chime]);

  const currentEvents = events.slice(0, eventCount).map((event, i) => ({ ...event, label: t.hero.events[i] ?? event.text })).reverse();
  const protectedTotal = events.slice(0, eventCount).reduce((sum, event) => sum + event.amount, 0);

  return (
    <section ref={sectionRef} id="inicio" className="relative min-h-dvh overflow-hidden border-b border-line pt-16">
      <FlowCanvas active={visible && !reduced} />
      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1440px] gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="max-w-3xl">
          <div className="eyebrow"><span className="signal-dot" /> {t.hero.eyebrow}</div>
          <h1 className="mt-7 font-display text-5xl leading-[1.02] tracking-normal text-foreground sm:text-6xl xl:text-[5.3rem]">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className={highlight.includes(word) ? "mr-[0.24em] inline-block text-flow" : "mr-[0.24em] inline-block"}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 0.08 + index * 0.055, duration: 0.35, ease: "easeOut" }}
              >{word}</motion.span>
            ))}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {t.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><a href="#contacto">{t.cta.schedule} <ArrowRight /></a></Button>
            <Button asChild size="lg" variant="outline"><a href="#fraude-lab">{t.cta.seeSystem} <ArrowDown /></a></Button>
          </div>
        </div>

        <aside aria-label={t.hero.panelLabel} className="ledger-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"><span className="signal-dot" /> terminal.verificación</div>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-flow">{t.hero.live}</span>
          </div>
          <div className="border-b border-line px-5 py-6">
            <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-subtle">{t.hero.protected}<br />{t.hero.simulation}</p>
            <p aria-live="polite" className="mt-2 font-mono text-3xl text-foreground">$ {protectedTotal.toLocaleString("es-CO")}</p>
          </div>
          <div className="min-h-[244px] divide-y divide-line" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {currentEvents.slice(0, 4).map((event, index) => (
                <motion.div key={event.text} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-start gap-3 px-5 py-4">
                  {event.alert ? <ShieldAlert className="mt-0.5 size-4 shrink-0 text-alert" /> : <Check className="mt-0.5 size-4 shrink-0 text-flow" />}
                  <div className="min-w-0 flex-1"><p className="font-mono text-[11px] leading-5 text-foreground">{event.label}</p><p className={event.alert ? "mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-alert" : "mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-flow"}>{event.alert ? t.hero.blocked : t.hero.verified} · {event.time}</p></div>
                  <span className="font-mono text-[9px] text-subtle">0{eventCount - index}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="border-t border-line px-5 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">{t.hero.footnote}</div>
        </aside>
      </div>
    </section>
  );
}