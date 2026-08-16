# Plan Integral de Integración y Buenas Prácticas: Casa Norden
**Versión:** 1.0.0  
**Fecha:** 16 de Agosto, 2026  
**Referencia de Producción:** `D:\proyectos-git\Franco Perdomo\website-francoperdomo-next`  
**Target:** `D:\proyectos-git\Casa Norden` (`casa-norden-next` & `casa-norden-payloadcms`)  
**Estado General:** 🚀 100% Completado y Validado End-to-End

---

## 🎯 Resumen Ejecutivo y Diagnóstico

### El Problema Inicial
Al editar o publicar contenidos en el panel de **Payload CMS**, el frontend de **Next.js** no reflejaba los cambios en tiempo real. 

### La Solución Implementada
Se implementó la arquitectura de revalidación incremental on-demand (ISR) con tags semánticos, webhooks automatizados, Route Handlers protegidos por token y optimizaciones de SEO/Sitemaps siguiendo las mejores prácticas del proyecto de referencia en producción.

---

## 🗺️ Matriz de Ejecución por Fases

```
[Fase 1: Capa de Datos & Cache Tags] ✅ ──> [Fase 2: Route Handler & Revalidación] ✅ ──> [Fase 3: Hooks en Payload] ✅
                                                                                                        │
[Fase 7: Verificación & QA E2E] ✅ <── [Fase 6: Variables de Entorno] ✅ <── [Fase 5: SEO & Sitemaps] ✅ <── [Fase 4: Runtime] ✅
```

---

## 📋 FASE 1: Capa de Datos y Estrategia de Tags Semánticos (`casa-norden-next`)

- [x] **1.1 Actualizar `lib/payload.ts` con constante de TTL y Tags**
  - `REVALIDATE_TIME` (0 en `development`, 30 días en `production`).
  - Tags asignados por entidad: `global_home`, `global_historia`, `collection_fechas`, `collection_lugares`, `collection_leyendas`, `collection_memorias`.
- [x] **1.2 Robustecer el cliente de fetch**
  - Headers `Cache-Control: no-cache`, `Pragma: no-cache`, `User-Agent: CasaNorden-Frontend/1.0`.
  - Reintentos y captura no bloqueante en compilación.

---

## 📋 FASE 2: Route Handler de Revalidación On-Demand (`casa-norden-next`)

- [x] **2.1 Crear `app/api/revalidate/route.ts`**
  - Autenticación por `REVALIDATION_TOKEN`.
  - Soporte de revalidación por `path` y por `tag`.
  - Respuestas JSON estructuradas con código HTTP 200/401/400/500.

---

## 📋 FASE 3: Hooks de Revalidación en Payload CMS (`casa-norden-payloadcms`)

- [x] **3.1 Crear Utilidad Reutilizable de Revalidación (`src/utilities/revalidate.ts`)**
  - Emisión de webhooks fetch no bloqueantes con logging informativo.
- [x] **3.2 Integrar Hooks en Colecciones**
  - `Fechas.ts`: `afterChange` y `afterDelete` $\rightarrow$ tag `fechas`, path `/fechas`.
  - `Lugares.ts`: `afterChange` y `afterDelete` $\rightarrow$ tag `lugares`, path `/lugares`.
  - `Leyendas.ts`: `afterChange` y `afterDelete` $\rightarrow$ tag `leyendas`, path `/leyendas`.
  - `Memorias.ts`: `afterChange` y `afterDelete` $\rightarrow$ tags `memorias` y `home`, paths `/memorias` y `/`.
- [x] **3.3 Integrar Hooks en Globals**
  - `Home.ts`: `afterChange` $\rightarrow$ tag `home`, path `/`.
  - `Historia.ts`: `afterChange` $\rightarrow$ tag `historia`, path `/historia`.

---

## 📋 FASE 4: Arquitectura de Despliegue en Cloudflare Pages / Workers

- [x] **4.1 Configurar `next.config.mjs`**
  - Removido `output: 'export'` para permitir Route Handlers y On-Demand ISR en Cloudflare.
  - Configurado `remotePatterns` para CDN (`cdn.casanorden.com.ar`), R2 y CMS.

---

## 📋 FASE 5: Sitemaps, Robots y SEO Semántico

- [x] **5.1 Crear `app/sitemap.ts`**
  - Generación de sitemap dinámico tipado (`MetadataRoute.Sitemap`) con directiva `force-dynamic`.
- [x] **5.2 Crear `app/robots.ts`**
  - Directivas de crawler y enlace a `https://casanorden.com.ar/sitemap.xml`.
- [x] **5.3 Enriquecer Metadatos y OpenGraph**
  - `app/layout.tsx`: `metadataBase`, templates de título, OpenGraph y Twitter Cards.
  - Páginas de sección: canonicals individuales (`alternates.canonical`).
- [x] **5.4 Implementar Datos Estructurados (Schema.org JSON-LD)**
  - Bloque `application/ld+json` con esquema `Organization` y memorial en `app/layout.tsx`.

---

## 📋 FASE 6: Matriz de Variables de Entorno & Seguridad

- [x] **6.1 Frontend (`casa-norden-next/.env` & `.env.example`)**: `NEXT_PUBLIC_PAYLOAD_URL`, `PAYLOAD_URL`, `REVALIDATION_TOKEN`, `NEXT_PUBLIC_SITE_URL`.
- [x] **6.2 Backend (`casa-norden-payloadcms/.env`)**: `FRONTEND_URL`, `REVALIDATION_TOKEN`.

---

## 📋 FASE 7: Verificación, Testing Local y QA

- [x] **7.1 Validación de compilación**: `npm run build` en Frontend y `generate:types` en Payload finalizados con éxito (Exit Code 0).
- [x] **7.2 Test de Revalidación End-to-End**: Edición guardada en Payload Admin (`Home`) disparó exitosamente `[Revalidation] Éxito al revalidar (home)` y Next.js respondió `GET /api/revalidate... 200 OK`.
- [x] **7.3 Servidores detenidos de forma limpia**: Recursos liberados.

---

## 📌 Registro de Cambios y Progreso

| Fecha | Fase | Acción Realizada | Estado |
| :--- | :--- | :--- | :--- |
| **16/08/2026** | **Fases 0 a 6** | Diseño, arquitectura, tags, route handlers, hooks en Payload y SEO/Sitemaps | ✅ Completado |
| **16/08/2026** | **Fase 7** | Prueba en vivo End-to-End de revalidación y sincronización en tiempo real | ✅ Validado con Éxito |
