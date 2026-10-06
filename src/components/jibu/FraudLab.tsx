import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, Clock3, RefreshCw, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const signals = [
  { title: "Fuente distinta", detail: "El monto no conserva la tipografía del resto del comprobante." },
  { title: "Hora inconsistente", detail: "La hora visible no coincide con la secuencia de la operación." },
  { title: "Referencia duplicada", detail: "La misma referencia ya aparece en otro registro procesado." },
];

const leaks = [
  { label: "Fraude con comprobantes falsos", start: 184000, step: 8500 },
  { label: "Sobrecostos en facturas de fletes", start: 427000, step: 12300 },
  { label: "Cobro de cartera manual", start: 96000, step: 4100 },
];

type Decision = "accept" | "reject" | "timeout" | null;

export function FraudLab() {
  const [remaining, setRemaining] = useState(5000);
  const [decision, setDecision] = useState<Decision>(null);
  const [revealed, setRevealed] = useState(0);
  const [lossTick, setLossTick] = useState(0);
  const [split, setSplit] = useState([50]);
  const labRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const decide = useCallback((choice: Exclude<Decision, null>) => {
    setDecision((current) => current ?? choice);
  }, []);

  useEffect(() => {
    if (decision) return;
    const started = performance.now();
    const timer = window.setInterval(() => {
      const next = Math.max(0, 5000 - (performance.now() - started));
      setRemaining(next);
      if (next === 0) {
        window.clearInterval(timer);
        decide("timeout");
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [decision, decide]);

  useEffect(() => {
    if (!decision) return;
    if (reduced) {
      setRevealed(signals.length);
      return;
    }
    setRevealed(0);
    const timers = signals.map((_, index) => window.setTimeout(() => setRevealed(index + 1), 420 * (index + 1)));
    return () => timers.forEach(window.clearTimeout);
  }, [decision, reduced]);

  useEffect(() => {
    const node = labRef.current;
    if (!node || reduced) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && timer === undefined) timer = window.setInterval(() => setLossTick((tick) => tick + 1), 1000);
      if (!entry?.isIntersecting && timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [reduced]);

  const reset = () => {
    setDecision(null);
    setRemaining(5000);
    setRevealed(0);
  };

  const response = decision === "reject"
    ? "Detectaste el riesgo. La verificación confirma que rechazar era la decisión correcta."
    : decision === "accept"
      ? "La apariencia era convincente. La verificación evita que esa presión recaiga sobre quien está en caja."
      : "El tiempo se agotó. El sistema habría validado la evidencia antes de pedir una decisión manual.";
  const splitValue = split[0] ?? 50;

  return (
    <section ref={labRef} id="fraude-lab" aria-labelledby="fraude-title" className="scroll-mt-16 border-b border-line bg-surface">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <div className="max-w-4xl">
          <p className="eyebrow"><span className="signal-dot" /> Fraude Lab · simulación</p>
          <h2 id="fraude-title" className="mt-5 font-display text-4xl leading-tight tracking-normal text-foreground md:text-6xl">Ponte en la caja. <em className="font-editorial font-normal text-flow">¿Aceptarías este pago?</em></h2>
        </div>

        <div className="mt-12 grid overflow-hidden border border-line bg-panel lg:grid-cols-[0.92fr_1.08fr]">
          <div className="border-b border-line p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-line pb-5">
              <div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-subtle">Comprobante de transferencia</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-alert">Documento ficticio · simulación</p></div>
              <span className="inline-flex items-center gap-2 border border-flow/30 bg-flow/5 px-3 py-1.5 font-mono text-[10px] uppercase text-flow"><Check className="size-3" /> Exitosa</span>
            </div>
            <div className="py-9 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Valor transferido</p>
              <p className="mt-3 font-mono text-4xl text-foreground sm:text-5xl"><span className="font-editorial italic">$</span> 485.000</p>
            </div>
            <dl className="divide-y divide-line border-y border-line font-mono text-xs">
              <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Hora</dt><dd className="text-foreground">14:67:03</dd></div>
              <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Referencia</dt><dd className="text-foreground">TX-8041-229A</dd></div>
              <div className="flex justify-between gap-4 py-4"><dt className="text-muted-foreground">Destino</dt><dd className="text-foreground">Caja principal</dd></div>
            </dl>
            {!decision && (
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em]"><span className="text-muted-foreground">Tiempo para decidir</span><span aria-live="polite" className="text-alert">{Math.ceil(remaining / 1000)} s</span></div>
                <div className="h-1.5 overflow-hidden bg-muted"><div className="h-full bg-alert transition-[width] duration-75" style={{ width: `${(remaining / 5000) * 100}%` }} /></div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button onClick={() => decide("accept")} variant="outline" size="lg"><Check /> Aceptar</Button>
                  <Button onClick={() => decide("reject")} size="lg"><X /> Rechazar</Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-[540px] flex-col p-5 sm:p-8" aria-live="polite">
            {!decision ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Clock3 className="size-8 text-alert" />
                <p className="mt-5 max-w-sm font-display text-2xl text-foreground">La fila avanza. El cliente espera.</p>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Solo tienes el comprobante para decidir si entregas el pedido.</p>
              </div>
            ) : (
              <AnimatePresence>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Análisis de evidencia</p>
                  <div className="mt-5 space-y-3">
                    {signals.map((signal, index) => (
                      index < revealed && <motion.div key={signal.title} initial={{ opacity: 0, x: reduced ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} className="border-l-2 border-alert bg-alert-soft px-4 py-3">
                        <div className="flex items-center gap-2"><AlertTriangle className="size-4 text-alert" /><p className="font-mono text-xs text-foreground">0{index + 1} · {signal.title}</p></div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{signal.detail}</p>
                      </motion.div>
                    ))}
                  </div>
                  {revealed === signals.length && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border-t border-line pt-6">
                      <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-flow" /><div><p className="font-mono text-sm text-flow">ConciliaIA lo habría bloqueado en 0.4 s</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{response}</p></div></div>
                      <Button onClick={reset} variant="ghost" className="mt-5"><RefreshCw /> Intentar de nuevo</Button>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Fugas operativas · simulación</p>
            <h3 className="mt-4 max-w-md font-display text-3xl leading-tight text-foreground md:text-4xl">Lo que no se verifica <em className="font-editorial font-normal text-alert">sigue corriendo.</em></h3>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {leaks.map((leak, index) => (
              <div key={leak.label} className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <p className="text-sm text-muted-foreground"><span className="mr-3 font-mono text-[10px] text-alert">0{index + 1}</span>{leak.label}</p>
                <p className="font-mono text-xl text-alert">$ {(leak.start + leak.step * lossTick).toLocaleString("es-CO")}</p>
              </div>
            ))}
            <p className="py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">Valores ilustrativos que aumentan cada segundo · simulación</p>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">Comparador operativo</p><h3 className="mt-4 font-display text-3xl text-foreground md:text-4xl">Arrastra para cambiar el flujo.</h3></div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{splitValue}% verificado</p>
          </div>
          <div className="relative h-[430px] overflow-hidden border border-line bg-panel sm:h-[360px]">
            <div className="absolute inset-0 grid content-center gap-5 bg-panel p-6 sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Sin JIBU</p>
              {["Captura recibida por chat", "Referencia copiada a una hoja", "Pedido liberado sin conciliación", "Diferencia descubierta al cierre"].map((item, index) => <div key={item} className="flex max-w-md items-center gap-3 font-mono text-xs text-muted-foreground"><span className="text-alert">0{index + 1}</span><span>{item}</span></div>)}
            </div>
            <div className="absolute inset-y-0 right-0 overflow-hidden border-l border-flow bg-background" style={{ width: `${splitValue}%` }}>
              <div className="absolute inset-y-0 right-0 grid w-[calc(100vw-2.5rem)] max-w-[1360px] content-center gap-5 p-6 sm:w-[calc(100vw-5rem)] sm:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-flow">Con JIBU</p>
                {["Pago recibido", "Evidencia contrastada", "Referencia conciliada", "Pedido liberado con trazabilidad"].map((item, index) => <div key={item} className="flex max-w-md items-center gap-3 font-mono text-xs text-foreground"><Check className="size-4 text-flow" /><span>{item}</span><span className="ml-auto hidden text-[9px] uppercase text-flow sm:inline">verificado</span></div>)}
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 border-l border-flow" style={{ left: `${100 - splitValue}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <span className="font-mono text-[10px] uppercase text-alert">Sin JIBU</span>
            <Slider aria-label="Comparar operación sin JIBU y con JIBU" value={split} onValueChange={setSplit} min={15} max={85} step={1} />
            <span className="font-mono text-[10px] uppercase text-flow">Con JIBU</span>
          </div>
        </div>

      </div>
    </section>
  );
}
