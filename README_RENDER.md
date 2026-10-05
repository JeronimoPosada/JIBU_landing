# Despliegue en Render — instrucciones rápidas

Recomendado: desplegar como *Static Site* (más simple y fiable).

Configurar en Render:
- Build Command: `npm ci && npm run build`
- Start Command (para sitio estático): no es necesario; Render servirá `dist/`.
- Static Publish Path: `dist`

Variables de entorno:
- Añade en el panel de Render las keys sensibles (Supabase, DATABASE_URL, etc.) — no subas `.env` al repo.

Si prefieres SSR:
- Revisa `dist/server/` tras `npm run build` y usa `node dist/server/server.js` o el entry que aparezca.

Ejemplo: `render.yaml.example` (plantilla incluida en el repo).