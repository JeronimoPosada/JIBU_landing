import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLead } from "@/lib/leads.functions";
import { leadSchema, leadSolutions, type LeadInput } from "@/lib/lead-schema";

// Cambia solo esta URL cuando esté listo el calendario definitivo de JIBU.
const CALENDAR_URL = "https://cal.com/jibu-p800kt/15min";
const selectionEvent = "jibu:select-solution";
const estimateEvent = "jibu:leak-estimate";

type FormValues = Pick<LeadInput, "nombre" | "empresa" | "correo" | "whatsapp" | "solucion">;
type Estimate = { display: Record<string, string>; ventasMensuales: number; perdidaEstimada: number };
type FieldName = keyof FormValues;

const initialValues: FormValues = { nombre: "", empresa: "", correo: "", whatsapp: "", solucion: "ConciliaIA" };
const fields: Array<{ name: FieldName; label: string; prompt: string; type?: string; autoComplete?: string; placeholder: string }> = [
  { name: "nombre", label: "Nombre", prompt: "¿Cómo te llamas?", autoComplete: "name", placeholder: "Tu nombre completo" },
  { name: "empresa", label: "Empresa", prompt: "¿En qué empresa trabajas?", autoComplete: "organization", placeholder: "Nombre de la empresa" },
  { name: "correo", label: "Correo electrónico", prompt: "¿A qué correo te respondemos?", type: "email", autoComplete: "email", placeholder: "nombre@empresa.com o nombre@gmail.com" },
  { name: "whatsapp", label: "Celular o WhatsApp", prompt: "¿Cuál es tu celular o WhatsApp?", type: "tel", autoComplete: "tel", placeholder: "+57 300 000 0000" },
  { name: "solucion", label: "Solución de interés", prompt: "¿Qué quieres poner en marcha?", placeholder: "Selecciona una solución" },
];

export function Contact() {
  const submitLead = useServerFn(createLead);
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const current = fields[step];

  useEffect(() => {
    const handleEstimate = (event: Event) => setEstimate((event as CustomEvent<Estimate>).detail);
    const handleSelection = (event: Event) => {
      const selected = (event as CustomEvent<string>).detail;
      if (leadSolutions.includes(selected as (typeof leadSolutions)[number])) setValues((previous) => ({ ...previous, solucion: selected as FormValues["solucion"] }));
    };
    window.addEventListener(estimateEvent, handleEstimate);
    window.addEventListener(selectionEvent, handleSelection);
    return () => { window.removeEventListener(estimateEvent, handleEstimate); window.removeEventListener(selectionEvent, handleSelection); };
  }, []);

  useEffect(() => {
    const form = document.getElementById("contacto-formulario");
    if (!form?.contains(document.activeElement)) return;
    inputRef.current?.focus({ preventScroll: true });
  }, [step]);

  const progress = useMemo(() => ((step + 1) / fields.length) * 100, [step]);

  const validateCurrent = () => {
    if (!current) return false;
    const result = leadSchema.shape[current.name].safeParse(values[current.name]);
    if (!result.success) { setError(result.error.issues[0]?.message ?? "Revisa este dato."); return false; }
    setError("");
    return true;
  };

  const next = () => {
    if (!validateCurrent()) return;
    setStep((value) => Math.min(fields.length - 1, value + 1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && step < fields.length - 1) { event.preventDefault(); next(); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Prevent accidental submits originating from non-submit buttons (e.g. select items rendered as buttons)
    const native = event.nativeEvent as unknown as SubmitEvent | undefined;
    const submitter = native?.submitter as HTMLElement | null | undefined;
    // Allow submit only if triggered by the real submit button or if there's no submitter and we're on last step
    if (submitter && submitter.id !== 'contact-submit') return;
    if (!submitter && step < fields.length - 1) return;
    
    // Honeypot check
    const formData = new FormData(event.currentTarget);
    if (formData.get("honeypot")) {
      // Bot detected, silently reject
      setStatus("sent"); 
      return;
    }

    const payload = { ...values, ventas_mensuales: estimate?.ventasMensuales ?? null, perdida_estimada: estimate?.perdidaEstimada ?? null };
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Revisa los datos."); return; }
    setStatus("sending"); setError("");
    try {
      await submitLead({ data: parsed.data });
      setStatus("sent");
    } catch {
      setStatus("idle"); setError("No pudimos enviar la solicitud. Intenta nuevamente.");
    }
  };

  return (
    <section id="contacto" className="scroll-mt-16 bg-surface">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
        <p className="eyebrow">Hablemos de tu operación</p>
        <div className="mt-6 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <h2 className="max-w-3xl font-display text-4xl leading-tight text-foreground md:text-6xl">Un diagnóstico claro empieza con <em className="font-editorial font-normal text-flow">cinco respuestas.</em></h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground">Compártenos el contexto esencial. Un ingeniero de JIBU revisará tu caso, sin intermediarios.</p>

            <form id="contacto-formulario" onSubmit={submit} className="mt-10 border border-line bg-panel p-5 sm:p-7" noValidate>
              {status === "sent" ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-72 flex-col items-start justify-center" role="status">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1, rotate: [0, -8, 0] }} transition={{ type: "spring", delay: 0.12 }} className="flex size-14 items-center justify-center rounded-full border border-flow text-flow"><Check className="size-7" /></motion.span>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-flow">Solicitud recibida</p>
                  <h3 className="mt-3 text-2xl font-medium text-foreground">Gracias, {values.nombre.split(" ")[0]}.</h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">Revisaremos tu caso y te contactaremos por el canal que compartiste.</p>
                </motion.div>
              ) : (
                <>
                  <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"><span>Conversación segura</span><span>{step + 1} / {fields.length}</span></div>
                  <div className="mt-3 h-px bg-line"><motion.div className="h-full bg-flow" animate={{ width: `${progress}%` }} /></div>
                  <AnimatePresence mode="wait">
                    {current && <motion.div key={current.name} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.24 }} className="min-h-52 py-9">
                      <p className="font-mono text-xs text-flow">jibu / contacto</p>
                      <Label htmlFor={`lead-${current.name}`} className="mt-3 block text-xl font-medium text-foreground">{current.prompt}</Label>
                      {current.name === "solucion" ? (
                        <Select value={values.solucion} onValueChange={(value) => { setValues((previous) => ({ ...previous, solucion: value as FormValues["solucion"] })); setError(""); }}>
                          <SelectTrigger id="lead-solucion" aria-label={current.label} className="mt-7 h-12"><SelectValue placeholder={current.placeholder} /></SelectTrigger>
                          <SelectContent>{leadSolutions.map((solution) => <SelectItem key={solution} value={solution}>{solution}</SelectItem>)}</SelectContent>
                        </Select>
                      ) : (
                        <Input ref={inputRef} id={`lead-${current.name}`} name={current.name} type={current.type ?? "text"} autoComplete={current.autoComplete} value={values[current.name]} onChange={(event) => { setValues((previous) => ({ ...previous, [current.name]: event.target.value })); setError(""); }} onKeyDown={onKeyDown} placeholder={current.placeholder} maxLength={current.name === "correo" ? 255 : current.name === "empresa" ? 120 : current.name === "whatsapp" ? 30 : 100} aria-invalid={Boolean(error)} aria-describedby={error ? "lead-error" : undefined} className="mt-7 h-12 text-base" />
                      )}
                      {error && <p id="lead-error" className="mt-3 text-sm text-alert" role="alert">{error}</p>}
                    </motion.div>}
                  </AnimatePresence>
                  {estimate && <div className="mb-5 border border-line bg-surface p-4 font-mono text-[10px] leading-5 text-muted-foreground"><p className="uppercase tracking-[0.1em] text-flow">Medidor adjunto · simulación</p><p className="mt-1">Ventas mensuales: {estimate.display["Ventas mensuales"]} · Pérdida mensual: {estimate.display["Pérdida mensual"]}</p></div>}
                  <div className="flex items-center justify-between gap-3">
                    <Button type="button" variant="ghost" onClick={() => { setError(""); setStep((value) => Math.max(0, value - 1)); }} disabled={step === 0 || status === "sending"} aria-label="Volver al campo anterior"><ArrowLeft /> Anterior</Button>
                    {step < fields.length - 1 ? <Button type="button" onClick={next}>Continuar <ArrowRight /></Button> : <Button id="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? <><LoaderCircle className="animate-spin" /> Enviando</> : <>Enviar solicitud <ArrowRight /></>}</Button>}
                  </div>
                </>
              )}
            </form>
          </div>

          <aside id="agenda" className="scroll-mt-24 lg:pt-2" aria-labelledby="agenda-title">
            <div className="mb-5 flex items-end justify-between gap-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Agenda directa</p><h3 id="agenda-title" className="mt-2 text-2xl font-medium text-foreground">Reserva 15 minutos</h3></div><span className="font-mono text-[10px] uppercase tracking-[0.1em] text-flow">Sin presentación genérica</span></div>
            <div className="overflow-hidden border border-line bg-panel"><iframe title="Agenda una llamada de 15 minutos con JIBU" src={CALENDAR_URL} className="h-[610px] w-full" loading="lazy" /></div>
          </aside>
        </div>
        <div id="privacidad" className="scroll-mt-24 border-t border-line pt-8 mt-20"><p className="max-w-3xl text-xs leading-6 text-muted-foreground"><strong className="font-medium text-foreground">Política de privacidad (Habeas Data).</strong> Usaremos tus datos únicamente para responder esta solicitud y coordinar el diagnóstico. Puedes solicitar su consulta, actualización o eliminación escribiendo a contacto.jibu@gmail.com. Diseñado bajo los principios de la Ley 1581 (Habeas Data).</p></div>
      </div>
    </section>
  );
}