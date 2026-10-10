# UCV · Bienestar emocional y apoyo académico

MVP de una plataforma web para estudiantes universitarios: reconocer el estado emocional, bajar la tensión con una micro-pausa, ordenar prioridades académicas y conversar con un asistente de escucha. **Apoya, no diagnostica.**

Proyecto del Bootcamp UCV · Hackathon de Salud Mental con IA.

## Funcionalidades

| Ruta | Qué hace |
|---|---|
| `/` | Pantalla de bienvenida con alias anónimo (Supabase) y, después, **Mi Clima Interno**: revisión voluntaria (clima, contexto, tensión, emoción, energía, concentración, dificultad) y orientación no clínica. |
| `/check-in` | Redirige a `/` (enlaces antiguos). |
| `/prioridades` | Una prioridad por área (Prácticas y Tesis), un primer paso pequeño y tareas editables. Los ejemplos están marcados como demostrativos. |
| `/pausa` | Temporizador de 180 s con respiración suave (4 s inhalar / 4 s exhalar, sin retenciones), guía de voz opcional, pausar/reanudar/detener y checklist de dos pasos. |
| `/asistente` | Chat de escucha con IA mediante `POST /api/chat`. Modo demostrativo si no hay clave. Botón para borrar la conversación. |
| `/autocuidado` | Identificación de emociones, ejercicios breves, preguntas de reflexión y acceso a apoyo. Ninguna actividad es obligatoria. |
| `/evaluacion` | Tensión posterior y comparación con la anterior **solo** si existen ambas respuestas (percepción subjetiva). |
| `/apoyo` | Acceso al Servicio de Psicología UCV, mensaje de normalización e instrucciones ante peligro inmediato. |
| `/jugadores` | Tabla de jugadores (ejemplo, pedido aparte). |

“Borrar sesión” (en la barra superior) vacía todos los datos de la sesión.

## Privacidad

- Anónimo por defecto: no hay registro, correo, DNI ni contraseña.
- El alias es lo único que se guarda: un UUID aleatorio en `localStorage` (`ucv-usuario-id`) y el alias en la tabla `usuarios_anonimos` de Supabase. No se vincula a correo ni a datos personales. Borrar los datos del navegador equivale a perder el refugio: no hay recuperación entre dispositivos.
- Las respuestas de Mi Clima Interno, el chat y la bitácora viven **solo en memoria** del navegador. No se usan cookies persistentes ni analíticas.
- El servidor no registra el contenido de los mensajes ni las respuestas del proveedor de IA.
- Al usar el asistente con IA configurada, el texto se envía a Anthropic para generar la respuesta. La pantalla lo informa.
- Los mensajes no se usan para entrenar modelos.

## Arquitectura

- **Next.js 15 (App Router)** + **React 19** + **TypeScript** + **Tailwind CSS v4**.
- `src/lib/session.tsx`: estado de sesión en memoria (contexto React).
- `src/lib/evaluacion.ts`, `src/lib/prioridades.ts`: lógica pura, sin IA.
- `src/lib/seguridad.ts`: detección simple de expresiones de riesgo que activa un mensaje de derivación. **No sustituye la evaluación humana.**
- `src/lib/config.ts`: datos institucionales configurables por variables de entorno.
- `src/app/api/chat/route.ts`: Route Handler que valida entradas (tamaño y formato), aplica un límite por IP y llama a la API de Anthropic **desde el servidor**.

## Ejecutar localmente

```bash
npm install
cp .env.example .env.local   # opcional: completa las variables
npm run dev
```

Abre http://localhost:3000.

Sin `ANTHROPIC_API_KEY`, el asistente funciona en **modo demostrativo** y lo indica en pantalla; no simula una IA conectada.

## Configurar la IA y el apoyo institucional

1. Crea una clave en la consola de Anthropic y colócala en `ANTHROPIC_API_KEY` (en `.env.local` o en Vercel → Settings → Environment Variables). Nunca la pongas en código ni en variables `NEXT_PUBLIC_`.
2. `ANTHROPIC_MODEL` por defecto es `claude-haiku-5-5`.
3. Completa `NEXT_PUBLIC_UCV_PSICOLOGIA_URL`, `NEXT_PUBLIC_UCV_PSICOLOGIA_CONTACTO` y `NEXT_PUBLIC_EMERGENCIA_CONTACTO` **solo con datos verificados** en fuentes oficiales. Mientras estén vacíos, la app muestra que están pendientes y no inventa datos.

## Calidad

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint (config de Next.js)
npm run test        # Vitest: lógica de Mi Clima Interno, prioridades y detección de riesgo
```

## Desplegar en Vercel

1. Importa el repositorio en Vercel (Framework: Next.js).
2. Define las variables de `.env.example` en el panel del proyecto.
3. Despliega. Cada push a `main` genera un nuevo despliegue.

## Limitaciones

- Es un MVP: no sustituye atención profesional ni servicios de emergencia.
- El límite de solicitudes (por IP y global) vive en memoria; en serverless cada instancia tiene su propio contador. Para un control real usa un almacén compartido (p. ej. Upstash/Redis) y un límite de gasto en la consola de Anthropic.
- `npm audit` reporta vulnerabilidades en Next.js 15 (incluido su PostCSS interno) que solo se corrigen actualizando a Next.js 16, un cambio mayor pendiente de evaluar.
- La detección de riesgo es por palabras clave y es orientativa.
- La guía de voz depende de que el navegador soporte síntesis de voz.
- El contenido de prioridades y ejercicios es genérico y debe revisarse con especialistas antes de un uso real.
