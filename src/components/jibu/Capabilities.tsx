import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowDown, ArrowRight, Check, Database, MessageCircle, Mic, ScanLine, Server, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrefs } from "@/lib/preferences";

const waiterPayments = [
  { table: "Mesa 12", amount: "$ 184.500", status: "Confirmado", suspicious: false },
  { table: "Mesa 04", amount: "$ 76.000", status: "Confirmado", suspicious: false },
  { table: "Mesa 09", amount: "$ 329.800", status: "Revisión", suspicious: true },
  { table: "Mesa 17", amount: "$ 91.200", status: "Confirmado", suspicious: false },
];

const contactSelectionEvent = "jibu:select-solution";

function chooseSolution(solution: string) {
  window.dispatchEvent(new CustomEvent(contactSelectionEvent, { detail: solution }));
  document.querySelector("#contacto-formulario")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function ModuleButton({ solution }: { solution: string }) {
  return <Button type="button" onClick={() => chooseSolution(solution)} variant="outline" className="mt-7">Quiero esto <ArrowDown /></Button>;
}

function ConciliaDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [visiblePayments, setVisiblePayments] = useState(1);
  const { chime } = usePrefs();

  useEffect(() => {
    if (active && !reduced && visiblePayments > 1 && !waiterPayments[visiblePayments - 1]?.suspicious) chime();
  }, [visiblePayments, active, reduced, chime]);

  useEffect(() => {
    if (reduced) {
      setVisiblePayments(waiterPayments.length);
      return;
    }
    if (!active) return;
    const timer = window.setInterval(() => setVisiblePayments((count) => count >= waiterPayments.length ? 1 : count + 1), 1900);
    return () => window.clearInterval(timer);
  }, [active, reduced]);

  return (
    <div aria-label="Simulación de conciliación de pagos para meseros" className="overflow-hidden border border-line bg-background/70">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 border-b border-line px-4 py-3 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground sm:px-5 sm:text-[9px]">
        <span className="flex items-center gap-2"><Smartphone className="size-3 text-flow" /> SMS bancario</span><ArrowRight className="size-3 text-subtle" /><span className="flex items-center justify-center gap-2"><Server className="size-3 text-flow" /> Backend</span><ArrowRight className="size-3 text-subtle" /><span className="flex items-center justify-end gap-2"><Database className="size-3 text-flow" /> Caja</span>
      </div>
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5"><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">Turno noche · pagos</p><span className="flex items-center gap-2 font-mono text-[9px] uppercase text-flow"><span className="signal-dot" /> En vivo</span></div>
      <div className="min-h-[264px] divide-y divide-line">
        <AnimatePresence mode="popLayout">
          {waiterPayments.slice(0, visiblePayments).map((payment) => (
            <motion.div key={payment.table} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={payment.suspicious ? "grid grid-cols-[1fr_auto] gap-2 bg-alert-soft px-4 py-4 sm:grid-cols-[1fr_1fr_auto] sm:px-5" : "grid grid-cols-[1fr_auto] gap-2 px-4 py-4 sm:grid-cols-[1fr_1fr_auto] sm:px-5"}>
              <span className="font-mono text-xs text-foreground">{payment.table}</span><span className="hidden font-mono text-xs text-muted-foreground sm:block">{payment.amount}</span><span className={payment.suspicious ? "flex items-center gap-2 font-mono text-[9px] uppercase text-alert" : "flex items-center gap-2 font-mono text-[9px] uppercase text-flow"}>{payment.suspicious ? <AlertTriangle className="size-3" /> : <Check className="size-3" />}{payment.status}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="border-t border-line px-4 py-3 font-mono text-[8px] uppercase tracking-[0.1em] text-subtle sm:px-5">Datos ficticios · simulación</p>
    </div>
  );
}

function FreightDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [recovered, setRecovered] = useState(184000);
  useEffect(() => {
    if (!active || reduced) return;
    const timer = window.setInterval(() => setRecovered((value) => value >= 263500 ? 184000 : value + 26500), 1600);
    return () => window.clearInterval(timer);
  }, [active, reduced]);

  return (
    <div className="relative overflow-hidden border border-line bg-background/70 p-4" aria-label="Simulación de auditoría de una factura de flete">
      <div className="flex items-center justify-between border-b border-line pb-3"><span className="font-mono text-[9px] uppercase text-muted-foreground">Factura FL-2048</span><ScanLine className="size-4 text-flow" /></div>
      <div className="relative mt-3 space-y-3 overflow-hidden font-mono text-[10px]">
        <div className="flex justify-between text-muted-foreground"><span>Flete base</span><span>$ 1.840.000</span></div>
        <div className="flex justify-between bg-alert-soft px-2 py-2 text-alert"><span>Recargo reexpedición</span><span>+$ 132.000</span></div>
        <div className="flex justify-between bg-alert-soft px-2 py-2 text-alert"><span>Espera no pactada</span><span>+$ 52.000</span></div>
        <div className="flex justify-between border-t border-line pt-3 text-foreground"><span>Total</span><span>$ 2.024.000</span></div>
        <motion.div className="absolute inset-x-0 h-px bg-flow shadow-[0_0_12px_var(--flow)]" initial={{ top: "0%" }} animate={active && !reduced ? { top: ["0%", "100%", "0%"] } : { top: "52%" }} transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }} />
      </div>
      <div className="mt-5 border-t border-line pt-4"><p className="font-mono text-[9px] uppercase tracking-[0.1em] text-subtle">Recuperado · simulación</p><p aria-live="polite" className="mt-1 font-mono text-2xl text-flow">$ {recovered.toLocaleString("es-CO")}</p></div>
    </div>
  );
}

function AgentsDemo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const messages = ["¿Está listo el estado de cuenta?", "Sí. Encontré 3 facturas pendientes y preparé el resumen.", "Envíalo al equipo de cartera."];
  const [messageCount, setMessageCount] = useState(1);
  useEffect(() => {
    if (reduced) {
      setMessageCount(messages.length);
      return;
    }
    if (!active) return;
    const timer = window.setInterval(() => setMessageCount((count) => count >= messages.length ? 1 : count + 1), 2100);
    return () => window.clearInterval(timer);
  }, [active, reduced]);

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_116px]" aria-label="Simulación de agente conversacional y llamada de voz">
      <div className="min-h-[218px] border border-line bg-background/70 p-4">
        <p className="flex items-center gap-2 border-b border-line pb-3 font-mono text-[9px] uppercase text-flow"><MessageCircle className="size-3" /> WhatsApp · agente</p>
        <div className="mt-4 space-y-3">
          <AnimatePresence>
            {messages.slice(0, messageCount).map((message, index) => <motion.p key={message} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} className={index % 2 === 0 ? "ml-auto max-w-[85%] border border-line bg-secondary px-3 py-2 text-[11px] leading-5 text-foreground" : "max-w-[90%] border-l-2 border-flow bg-flow/5 px-3 py-2 text-[11px] leading-5 text-foreground"}>{message}</motion.p>)}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex min-h-[116px] flex-col items-center justify-center border border-line bg-background/70 p-3">
        <Mic className="size-4 text-flow" />
        <div className="mt-5 flex h-12 items-center gap-1" aria-hidden="true">{[12, 25, 38, 20, 44, 30, 16].map((height, index) => <motion.span key={index} className="w-1 bg-flow" initial={{ height: 8 }} animate={active && !reduced ? { height: [8, height, 8] } : { height }} transition={{ duration: 0.65, delay: index * 0.08, repeat: Infinity }} />)}</div>
        <span className="mt-4 font-mono text-[8px] uppercase text-muted-foreground">Llamada activa</span>
      </div>
    </div>
  );
}

export function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const active = useInView(sectionRef, { margin: "-8% 0px" });
  const reduced = Boolean(useReducedMotion());

  return (
    <section ref={sectionRef} id="modulos" aria-labelledby="modulos-title" className="scroll-mt-16 border-b border-line bg-background">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-8 border-b border-line pb-12 lg:grid-cols-[1fr_0.72fr]">
          <div><p className="eyebrow"><span className="signal-dot" /> Módulos</p><h2 id="modulos-title" className="mt-5 max-w-3xl font-display text-4xl leading-tight tracking-normal text-foreground md:text-6xl">Tres sistemas. <em className="font-editorial font-normal text-flow">Una operación verificable.</em></h2></div>
          <p className="max-w-lg self-end text-base leading-7 text-muted-foreground lg:justify-self-end">Tecnología aplicada al punto exacto donde una empresa pierde control, tiempo o dinero.</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <article className="border border-line bg-panel p-5 sm:p-7 lg:col-span-7 lg:row-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-flow">01 · ConciliaIA</p>
            <h3 className="mt-4 max-w-xl font-display text-3xl leading-tight text-foreground md:text-4xl">Copiloto anti-fraude y conciliación instantánea.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Confirma pagos para comercios y restaurantes antes de que el equipo libere un pedido.</p>
            <ul className="my-6 grid gap-2 font-mono text-[10px] uppercase leading-5 text-muted-foreground sm:grid-cols-3"><li>Verificación en segundos</li><li>Alertas de duplicados</li><li>Vista para meseros</li></ul>
            <ConciliaDemo active={active} reduced={reduced} />
            <ModuleButton solution="ConciliaIA" />
          </article>

          <article className="border border-line bg-surface p-5 sm:p-7 lg:col-span-5">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-1 xl:grid-cols-[0.82fr_1.18fr]">
              <div><p className="font-mono text-xs uppercase tracking-[0.12em] text-flow">02 · AuditaFletes</p><h3 className="mt-4 font-display text-3xl leading-tight text-foreground">Sobrecostos detectados antes de pagarlos.</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">Auditoría automática bajo modelo success-fee: si no recuperamos, no pagas.</p><ul className="mt-5 space-y-2 font-mono text-[10px] uppercase leading-5 text-muted-foreground"><li>Tarifas vs. factura</li><li>Recargos no pactados</li><li>Evidencia recuperable</li></ul><ModuleButton solution="AuditaFletes" /></div>
              <FreightDemo active={active} reduced={reduced} />
            </div>
          </article>

          <article className="border border-line bg-panel p-5 sm:p-7 lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-flow">03 · Agentes de IA + software</p>
            <h3 className="mt-4 font-display text-3xl leading-tight text-foreground">Automatización hecha alrededor de tu operación.</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">WhatsApp, llamadas de voz e infraestructura de datos personalizada.</p>
            <ul className="my-5 grid gap-2 font-mono text-[10px] uppercase leading-5 text-muted-foreground sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"><li>Conversaciones</li><li>Voz automatizada</li><li>Datos a la medida</li></ul>
            <AgentsDemo active={active} reduced={reduced} />
            <ModuleButton solution="Agentes de IA y software a la medida" />
          </article>
        </div>
      </div>
    </section>
  );
}
