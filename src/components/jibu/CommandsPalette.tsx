import { CalendarClock, Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { usePrefs } from "@/lib/preferences";

export const openPaletteEvent = "jibu:open-palette";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { t } = usePrefs();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(openPaletteEvent, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(openPaletteEvent, onOpen);
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const sections: [string, string][] = [
    [t.palette.top, "inicio"],
    [t.palette.evidence, "evidencia"],
    [t.nav.fraud, "fraude-lab"],
    [t.nav.modules, "modulos"],
    [t.nav.calculator, "calculadora"],
    [t.nav.process, "proceso"],
    [t.nav.contact, "contacto"],
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t.palette.hint} />
      <CommandList>
        <CommandEmpty>{t.palette.empty}</CommandEmpty>
        <CommandGroup heading={t.palette.actions}>
          <CommandItem onSelect={() => go("agenda")}><CalendarClock /> {t.palette.calendar}</CommandItem>
        </CommandGroup>
        <CommandGroup heading={t.palette.sections}>
          {sections.map(([label, id]) => <CommandItem key={id} value={`${label} ${id}`} onSelect={() => go(id)}><Hash /> {label}</CommandItem>)}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
