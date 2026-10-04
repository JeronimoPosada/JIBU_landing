CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nombre text NOT NULL CHECK (char_length(nombre) BETWEEN 2 AND 100),
  empresa text NOT NULL CHECK (char_length(empresa) BETWEEN 2 AND 120),
  correo text NOT NULL CHECK (char_length(correo) <= 255),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 7 AND 30),
  solucion text NOT NULL CHECK (solucion IN ('ConciliaIA', 'AuditaFletes', 'Agentes de IA y software a la medida')),
  ventas_mensuales numeric(16,2),
  perdida_estimada numeric(16,2),
  CONSTRAINT leads_ventas_mensuales_nonnegative CHECK (ventas_mensuales IS NULL OR ventas_mensuales >= 0),
  CONSTRAINT leads_perdida_estimada_nonnegative CHECK (perdida_estimada IS NULL OR perdida_estimada >= 0)
);

GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

COMMENT ON TABLE public.leads IS 'Contact requests submitted from the public JIBU website. Public roles may insert only; no public read policy exists.';