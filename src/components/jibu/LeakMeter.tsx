import { ArrowDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const cop = (n: number) => `$${Math.round(n).toLocaleString("es-CO")}`;
const pct = (n: number) => `${n.toLocaleString("es-CO", { maximumFractionDigits: 2 })}%`;

type FieldT = { key: Key; label: string; min: number; max: number; step: number; unit: "cop" | "pct" };

const inputs: FieldT[] = [
  { key: "sales", label: "Ventas mensuales", min: 0, max: 1_000_000_000, step: 1_000_000, unit: "cop" },
  { key: "transfer", label: "% de pagos por transferencia", min: 0, max: 100, step: 1, unit: "pct" },
  { key: "freight", label: "Gasto mensual en fletes", min: 0, max: 500_000_000, step: 1_000_000, unit: "cop" },
];
const assumptions: FieldT[] = [
  { key: "fraudRate", label: "Tasa de fraude sobre transferencias", min: 0, max: 5, step: 0.1, unit: "pct" },
  { key: "overcharge", label: "Sobrecosto promedio en fletes", min: 0, max: 20, step: 0.5, unit: "pct" },
  { key: "detection", label: "Fraude que se detectaría", min: 0, max: 100, step: 1, unit: "pct" },
  { key: "recoverable", label: "Sobrecosto recuperable", min: 0, max: 100, step: 1, unit: "pct" },
];
const defaults = { sales: 50_000_000, transfer: 60, freight: 20_000_000, fraudRate: 0.8, overcharge: 6, detection: 85, recoverable: 70 };
type Values = typeof defaults;
type Key = keyof Values;

function RollingNumber({ value }: { value: string }) {
  const reduced = useReducedMotion();
  return (
    <span className="inline-flex overflow-hidden" aria-label={value}>
      {value.split("").map((ch, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block h-[1.1em] overflow-hidden leading-[1.1em]">
          <motion.span key={ch} className="block" initial={{ y: "-100%" }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}>{ch}</motion.span>
        </span>
      ))}
    </span>
  );
}

function FieldControl({ f, value, onChange, compact }: { f: FieldT; value: number; onChange: (v: number) => void; compact?: boolean }) {
  const id = `leak-${f.key}`;
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{f.label}</label>
        <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
          {f.unit === "cop" && <span>$</span>}
          <Input id={id} type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} value={value}
            onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) onChange(Math.min(f.max, Math.max(f.min, n))); }}
            className={`h-8 text-right font-mono text-xs ${f.unit === "cop" ? "w-36" : "w-20"}`} />
          {f.unit === "pct" && <span>%</span>}
        </div>
      </div>
      <Slider aria-label={f.label} min={f.min} max={f.max} step={f.step} value={[value]} onValueChange={([n]) => onChange(n ?? f.min)} />
    </div>
  );
}

export function LeakMeter() {
  const [v, setV] = useState<Values>(defaults);
  const set = (k: Key) => (n: number) => setV((p) => ({ ...p, [k]: n }));

  const fraudLoss = v.sales * (v.transfer / 100) * (v.fraudRate / 100);
  const freightLoss = v.freight * (v.overcharge / 100);
  const lossM = fraudLoss + freightLoss;
  const recM = fraudLoss * (v.detection / 100) + freightLoss * (v.recoverable / 100);
  const lossY = lossM * 12;
  const recY = recM * 12;
  const maxBar = Math.max(lossY, 1);

  const sendToForm = () => {
    const display = {
      "Ventas mensuales": cop(v.sales), "% transferencia": pct(v.transfer), "Fletes/mes": cop(v.freight),
      "Tasa de fraude": pct(v.fraudRate), "Sobrecosto fletes": pct(v.overcharge), "% detección": pct(v.detection), "% recuperable": pct(v.recoverable),
      "Pérdida mensual": cop(lossM), "Pérdida anual": cop(lossY), "Recuperación mensual": cop(recM), "Recuperación anual": cop(recY),
    };
    const detail = { display, ventasMensuales: v.sales, perdidaEstimada: lossM };
    window.dispatchEvent(new CustomEvent("jibu:leak-estimate", { detail }));
    document.getElementById("contacto-formulario")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section id="calculadora" aria-labelledby="calculadora-title" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="eyebrow">Medidor de fuga · simulación</p>
        <h2 id="calculadora-title" className="mt-6 max-w-3xl font-display text-4xl leading-tight text-foreground md:text-6xl">¿Cuánto se está yendo <em className="font-editorial font-normal text-alert">sin que lo veas?</em></h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="space-y-6">
            <div className="space-y-6 border border-line bg-surface p-5 sm:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">Tu operación</p>
              {inputs.map((f) => <FieldControl key={f.key} f={f} value={v[f.key]} onChange={set(f.key)} />)}
            </div>
            <div className="space-y-5 border border-dashed border-line p-5 sm:p-7">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground">Supuestos (editables)</p>
                <button type="button" onClick={() => setV(defaults)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground underline underline-offset-4 hover:text-foreground">Restaurar</button>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {assumptions.map((f) => <FieldControl key={f.key} f={f} value={v[f.key]} onChange={set(f.key)} compact />)}
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-line bg-panel p-5 sm:p-7">
            <div className="grid gap-px bg-line sm:grid-cols-2">
              {[["Pérdida mensual", lossM, "text-alert"], ["Pérdida anual", lossY, "text-alert"], ["Recuperación mensual", recM, "text-flow"], ["Recuperación anual", recY, "text-flow"]].map(([label, n, tone]) => (
                <div key={label as string} className="bg-panel p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{label as string}</p>
                  <p className={`mt-2 font-mono text-2xl tabular-nums md:text-3xl ${tone}`}><RollingNumber value={cop(n as number)} /></p>
                </div>
              ))}
            </div>

            <div className="mt-8" role="img" aria-label={`Pérdida anual estimada ${cop(lossY)} frente a recuperación estimada ${cop(recY)}`}>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Pérdida anual estimada vs. recuperación estimada</p>
              {[["Pérdida", lossY, "bg-alert"], ["Recuperación", recY, "bg-flow"]].map(([label, n, bg]) => (
                <div key={label as string} className="mt-4">
                  <div className="flex justify-between font-mono text-[11px] text-muted-foreground"><span>{label as string}</span><span>{cop(n as number)}</span></div>
                  <div className="mt-2 h-4 w-full bg-surface">
                    <motion.div className={`h-full ${bg}`} initial={false} animate={{ width: `${((n as number) / maxBar) * 100}%` }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-1 border-t border-line pt-5 font-mono text-[10px] leading-5 text-muted-foreground">
              <p>Pérdida por fraude/mes = ventas × %transferencia × tasa de fraude = {cop(fraudLoss)}</p>
              <p>Pérdida por fletes/mes = gasto fletes × sobrecosto = {cop(freightLoss)}</p>
              <p>Recuperación/mes = (pérdida fraude × %detección) + (pérdida fletes × %recuperable)</p>
              <p>Anual = mensual × 12</p>
            </div>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">Estimación ilustrativa antes del costo del servicio; el diagnóstico gratuito la reemplaza con tus datos reales.</p>
            <Button size="lg" onClick={sendToForm} className="mt-6 self-start">Recibir este análisis <ArrowDown /></Button>
          </div>
        </div>
      </div>
    </section>
  );
}
