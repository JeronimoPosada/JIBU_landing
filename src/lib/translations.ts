export type Lang = "es" | "en";

export const translations = {
  es: {
    nav: { fraud: "Fraude Lab", modules: "Módulos", calculator: "Calculadora", process: "Proceso", contact: "Contacto", main: "Navegación principal", mobile: "Navegación móvil", open: "Abrir navegación" },
    cta: { schedule: "Agendar demostración", seeSystem: "Ver el sistema en acción" },
    hero: {
      eyebrow: "Verificación de pagos · simulación",
      title: "Tu caja no debería creerle a una captura de pantalla.",
      highlight: ["captura", "pantalla."],
      subtitle: "JIBU construye sistemas de IA que verifican pagos, auditan sobrecostos y automatizan la operación de tu empresa en tiempo real. Sin cambiar cómo trabajas hoy.",
      panelLabel: "Eventos simulados de verificación",
      live: "En vivo",
      protected: "Dinero protegido en esta sesión",
      simulation: "(simulación)",
      blocked: "Bloqueado",
      verified: "Verificado",
      footnote: "Datos ficticios · No conecta entidades financieras",
      events: ["Transferencia $85.000 conciliada", "Comprobante duplicado bloqueado", "Pago de proveedor verificado", "Monto atípico enviado a revisión", "Venta y abono conciliados"],
    },
    palette: { hint: "Buscar sección o acción…", empty: "Sin resultados.", sections: "Secciones", actions: "Acciones", top: "Inicio", evidence: "Evidencia técnica", calendar: "Abrir agendamiento de 15 minutos", open: "Abrir paleta de comandos" },
    sound: { on: "Sonido activado", off: "Sonido silenciado" },
    lang: { switch: "Cambiar idioma a inglés", label: "EN" },
  },
  en: {
    nav: { fraud: "Fraud Lab", modules: "Modules", calculator: "Calculator", process: "Process", contact: "Contact", main: "Main navigation", mobile: "Mobile navigation", open: "Open navigation" },
    cta: { schedule: "Book a demo", seeSystem: "See the system in action" },
    hero: {
      eyebrow: "Payment verification · simulation",
      title: "Your cash register shouldn't trust a screenshot.",
      highlight: ["trust", "screenshot."],
      subtitle: "JIBU builds AI systems that verify payments, audit overcharges and automate your company's operations in real time. Without changing how you work today.",
      panelLabel: "Simulated verification events",
      live: "Live",
      protected: "Money protected this session",
      simulation: "(simulation)",
      blocked: "Blocked",
      verified: "Verified",
      footnote: "Fictitious data · Not connected to financial institutions",
      events: ["$85,000 transfer reconciled", "Duplicate receipt blocked", "Supplier payment verified", "Unusual amount sent to review", "Sale and deposit reconciled"],
    },
    palette: { hint: "Search a section or action…", empty: "No results.", sections: "Sections", actions: "Actions", top: "Home", evidence: "Technical evidence", calendar: "Open 15-minute scheduling", open: "Open command palette" },
    sound: { on: "Sound on", off: "Sound muted" },
    lang: { switch: "Switch language to Spanish", label: "ES" },
  },
} as const;

export type Dict = (typeof translations)[Lang];
