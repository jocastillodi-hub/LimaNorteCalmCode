import { NextResponse } from "next/server";
import { haySenalDeRiesgo } from "@/lib/seguridad";

export const runtime = "nodejs";

const MAX_MENSAJE = 1500;
const MAX_HISTORIAL = 12;
const MAX_CUERPO = 20_000; // bytes
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 20;

// Límite por IP y global, en memoria. En Vercel cada instancia tiene su propio contador:
// para un control estricto usa un almacén compartido (p. ej. Upstash/Redis).
const contadores = new Map<string, { inicio: number; n: number }>();
const TOPE_GLOBAL = 300; // solicitudes totales por ventana en esta instancia

function contar(clave: string, tope: number) {
  const ahora = Date.now();
  const r = contadores.get(clave);
  if (!r || ahora - r.inicio > VENTANA_MS) {
    contadores.set(clave, { inicio: ahora, n: 1 });
    return true;
  }
  r.n += 1;
  return r.n <= tope;
}

// Vercel añade x-vercel-forwarded-for y el cliente no puede falsearlo.
// x-forwarded-for sí puede falsificarse, así que solo se usa si no hay otra opción.
function ipCliente(req: Request) {
  return (
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "desconocida"
  );
}

const SYSTEM_PROMPT = `Eres un asistente de escucha y orientación general para estudiantes universitarios, dentro de una plataforma de bienestar emocional.
Reglas:
- Escucha sin juzgar, minimizar ni ridiculizar. Responde con empatía, en español natural y breve.
- Valida las emociones sin asumir que conoces toda la situación; haz como máximo una pregunta abierta y breve.
- Ofrece como mucho dos estrategias prácticas y pequeñas (autorregulación, organización, pedir apoyo).
- No diagnostiques, no prescribas medicamentos, no hagas afirmaciones clínicas ni recomiendes abandonar tratamientos.
- No fomentes dependencia ni aislamiento: anima a hablar con personas de confianza o con profesionales.
- Recuerda, cuando sea pertinente, que eres una herramienta automatizada y no un psicólogo ni un servicio de emergencia.
- Si el usuario expresa peligro inmediato, autolesión o intención suicida, responde con calidez, pide que contacte de inmediato a los servicios de emergencia de su zona o a una persona de confianza, y no intentes evaluar el riesgo por tu cuenta.
- No afirmes que hay supervisión humana o monitoreo.`;

type MensajeEntrada = { rol: "usuario" | "asistente"; texto: string };

function respuestaDemo(ultimo: string) {
  const riesgo = haySenalDeRiesgo(ultimo);
  if (riesgo) {
    return "Gracias por contarme esto. Lo más importante ahora es tu seguridad: contacta de inmediato a los servicios de emergencia de tu zona o a una persona de confianza que esté contigo. (Modo demostrativo: sin IA externa conectada.)";
  }
  return "Gracias por contarme. Lo que describes suena pesado. ¿Qué te gustaría hacer ahora: desahogarte, ordenar tus ideas o buscar una estrategia? (Modo demostrativo: esta respuesta es de ejemplo, no proviene de una IA externa conectada.)";
}

export async function POST(req: Request) {
  const ip = ipCliente(req);
  if (!contar(`ip:${ip}`, MAX_POR_VENTANA) || !contar("global", TOPE_GLOBAL)) {
    return NextResponse.json(
      { error: "Has enviado muchos mensajes seguidos. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 },
    );
  }

  const tamano = Number(req.headers.get("content-length") ?? "0");
  if (tamano > MAX_CUERPO) {
    return NextResponse.json({ error: "El mensaje es demasiado largo." }, { status: 413 });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }

  const mensajes = (cuerpo as { mensajes?: unknown })?.mensajes;
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return NextResponse.json({ error: "Escribe un mensaje para continuar." }, { status: 400 });
  }

  const limpios: MensajeEntrada[] = [];
  for (const m of mensajes.slice(-MAX_HISTORIAL)) {
    const rol = (m as MensajeEntrada)?.rol;
    const texto = (m as MensajeEntrada)?.texto;
    if ((rol !== "usuario" && rol !== "asistente") || typeof texto !== "string") {
      return NextResponse.json({ error: "Formato de mensaje no válido." }, { status: 400 });
    }
    const recortado = texto.trim().slice(0, MAX_MENSAJE);
    if (recortado) limpios.push({ rol, texto: recortado });
  }

  const ultimo = [...limpios].reverse().find((m) => m.rol === "usuario");
  if (!ultimo) {
    return NextResponse.json({ error: "Escribe un mensaje para continuar." }, { status: 400 });
  }

  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) {
    return NextResponse.json({ demo: true, respuesta: respuestaDemo(ultimo.texto) });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": clave,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: limpios.map((m) => ({
          role: m.rol === "usuario" ? "user" : "assistant",
          content: m.texto,
        })),
      }),
    });

    if (!r.ok) {
      // No registramos el contenido del mensaje ni la respuesta del proveedor.
      return NextResponse.json(
        { error: "El asistente no está disponible en este momento. Inténtalo más tarde." },
        { status: 502 },
      );
    }

    const data = (await r.json()) as { content?: { type: string; text?: string }[] };
    const texto = data.content?.find((b) => b.type === "text")?.text ?? "";
    return NextResponse.json({ demo: false, respuesta: texto });
  } catch {
    return NextResponse.json(
      { error: "No pudimos conectar con el asistente. Revisa tu conexión e inténtalo de nuevo." },
      { status: 502 },
    );
  }
}
