import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { leadSchema } from "@/lib/lead-schema";
import type { Database } from "@/integrations/supabase/types";

export const createLead = createServerFn({ method: "POST" })
  .validator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const fetchFn = globalThis.fetch;
    if (!fetchFn) {
      throw new Error("La API fetch no está disponible en este entorno.");
    }

    const supabase = createClient<Database>(process.env['SUPABASE_URL']!, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetchFn(input, { ...init, headers });
        },
      },
    });

    const { error } = await supabase.from("leads").insert({
      nombre: data.nombre,
      empresa: data.empresa,
      correo: data.correo,
      whatsapp: data.whatsapp,
      solucion: data.solucion,
      ventas_mensuales: data.ventas_mensuales ?? null,
      perdida_estimada: data.perdida_estimada ?? null,
    });
    if (error) throw new Error("No fue posible guardar la solicitud.");
    return { ok: true };
  });