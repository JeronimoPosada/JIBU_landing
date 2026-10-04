import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { PreferencesProvider } from "@/lib/preferences";
import { CommandPalette } from "@/components/jibu/CommandPalette";
import { Spotlight } from "@/components/jibu/Spotlight";
import { Header } from "@/components/jibu/Header";
import { LedgerHero } from "@/components/jibu/LedgerHero";
import { BootSequence } from "@/components/jibu/BootSequence";

const Modules = lazy(() => import("@/components/jibu/Capabilities").then((m) => ({ default: m.Capabilities })));
const TechnicalEvidence = lazy(() => import("@/components/jibu/TechnicalEvidence").then((m) => ({ default: m.TechnicalEvidence })));
const FraudLab = lazy(() => import("@/components/jibu/FraudLab").then((m) => ({ default: m.FraudLab })));
const LeakMeter = lazy(() => import("@/components/jibu/LeakMeter").then((m) => ({ default: m.LeakMeter })));
const Method = lazy(() => import("@/components/jibu/Method").then((m) => ({ default: m.Method })));
const Contact = lazy(() => import("@/components/jibu/Contact").then((m) => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/jibu/Footer").then((m) => ({ default: m.Footer })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JIBU | Inteligencia financiera y automatización" },
      { name: "description", content: "Sistemas de software e IA para detectar fraude, conciliar operaciones y encontrar fugas en el flujo de caja." },
      { property: "og:title", content: "JIBU | Inteligencia financiera en movimiento" },
      { property: "og:description", content: "Automatización operativa e inteligencia financiera para empresas en Colombia y LATAM." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://live-ledger-live-demo.lovable.app/" },
      { property: "og:site_name", content: "JIBU Studio" },
      { property: "og:locale", content: "es_CO" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "JIBU | Inteligencia financiera en movimiento" },
      { name: "twitter:description", content: "Sistemas de IA que verifican pagos, auditan sobrecostos y automatizan la operación." },
    ],
    links: [{ rel: "canonical", href: "https://live-ledger-live-demo.lovable.app/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "JIBU Studio",
        alternateName: "JIBU",
        slogan: "Intelligent systems in motion",
        url: "https://live-ledger-live-demo.lovable.app/",
        logo: "https://live-ledger-live-demo.lovable.app/favicon.png",
        email: "hola@jibu.studio",
        areaServed: ["CO", "LATAM"],
        sameAs: ["https://www.linkedin.com/company/jibu-studio", "https://github.com/jibu-studio", "https://www.instagram.com/jibu.studio"],
      }),
    }],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    console.log(
      "%cJIBU%c  intelligent systems in motion\n\n¿Lees consolas por gusto? Nosotros también.\nSi te interesa construir sistemas que atrapan fraude en tiempo real, escríbenos: hola@jibu.studio\n\n> verificando_curiosidad... ✓",
      "font: 600 22px 'Space Grotesk', sans-serif; letter-spacing: 0.2em; color: #22D3EE;",
      "font: 12px 'JetBrains Mono', monospace; color: #F4F6FA;",
    );
  }, []);

  return (
    <PreferencesProvider>
      <Header />
      <CommandPalette />
      <Spotlight />
      <BootSequence />
      <LedgerHero />
      <Suspense fallback={<div className="h-48 border-b border-line bg-surface" aria-hidden="true" />}>
        <TechnicalEvidence />
        <FraudLab />
        <Modules />
        <LeakMeter />
        <Method />
        <Contact />
        <Footer />
      </Suspense>
    </PreferencesProvider>
  );
}
