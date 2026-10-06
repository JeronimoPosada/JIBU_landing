import { Command, Menu, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { usePrefs } from "@/lib/preferences";
import { openPaletteEvent } from "./CommandPalette";

export function Header() {
  const [open, setOpen] = useState(false);
  const { t, toggleLang, sound, toggleSound } = usePrefs();
  const links: [string, string][] = [[t.nav.fraud, "#fraude-lab"], [t.nav.modules, "#modulos"], [t.nav.calculator, "#calculadora"], [t.nav.process, "#proceso"], [t.nav.contact, "#contacto"]];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/40 bg-background/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-5 md:px-10">
        <a href="#inicio" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80">
          <img src={logoAsset} alt="Logo de JIBU" className="size-9 rounded-lg object-contain border border-line/40 bg-background/80" />
          <span className="font-display text-lg tracking-[0.24em] text-foreground">JIBU</span>
        </a>
        <nav aria-label={t.nav.main} className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map(([label, href]) => <a key={href} className="nav-link" href={href}>{label}</a>)}
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hidden min-h-11 min-w-11 md:inline-flex" aria-label={`${t.palette.open} (Ctrl/Cmd + K)`} onClick={() => window.dispatchEvent(new Event(openPaletteEvent))}><Command /></Button>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11" aria-pressed={sound} aria-label={sound ? t.sound.on : t.sound.off} title={sound ? t.sound.on : t.sound.off} onClick={toggleSound}>
            {sound ? <Volume2 className="text-flow" /> : <VolumeX />}
          </Button>
          <Button variant="ghost" className="min-h-11 min-w-11 px-2 font-mono text-xs tracking-[0.12em]" aria-label={t.lang.switch} onClick={toggleLang}>{t.lang.label}</Button>
          <Button asChild variant="outline" className="ml-2 hidden lg:inline-flex"><a href="#contacto">{t.cta.schedule}</a></Button>
          <Button variant="ghost" size="icon" className="min-h-11 min-w-11 lg:hidden" aria-label={t.nav.open} aria-expanded={open} onClick={() => setOpen(!open)}><Menu /></Button>
        </div>
      </div>
      {open && (
        <nav aria-label={t.nav.mobile} className="border-t border-line bg-background px-5 py-5 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="min-h-11 py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</a>
            ))}
            <a href="#contacto" onClick={() => setOpen(false)} className="min-h-11 py-3 font-mono text-xs uppercase tracking-[0.16em] text-flow">{t.cta.schedule}</a>
          </div>
        </nav>
      )}
    </header>
  );
}
