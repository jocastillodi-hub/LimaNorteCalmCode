"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSesion } from "@/lib/session";
import { crearAlias, obtenerAlias, supabase } from "@/lib/supabase";

// Identidad anónima: el id (UUID) vive en este navegador; el alias vive en Supabase.
const CLAVE_ID = "ucv-usuario-id";
const CLAVE_ALIAS = "ucv-alias";
const ALIAS_MIN = 2;
const ALIAS_MAX = 24;
// Debe coincidir con la duración de `.bienvenida` en globals.css.
const DURACION_SALIDA_MS = 800;

type Verificacion = "cargando" | "sin-alias" | "con-alias";

function leerLocal(clave: string): string | null {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    // Sin localStorage (modo privado estricto) se trata como usuario nuevo.
    return null;
  }
}

function escribirLocal(valores: Record<string, string | null>) {
  try {
    for (const [clave, valor] of Object.entries(valores)) {
      if (valor === null) window.localStorage.removeItem(clave);
      else window.localStorage.setItem(clave, valor);
    }
  } catch {
    // Sin localStorage la identidad solo dura mientras la página esté abierta.
  }
}

export default function WelcomeScreen() {
  const { alias, setAlias, fase, setFase } = useSesion();
  const [verificacion, setVerificacion] = useState<Verificacion>("cargando");
  const [borrador, setBorrador] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Al montar: ¿existe un id local y un alias en Supabase para él?
  useEffect(() => {
    let cancelado = false;

    async function verificar() {
      const id = leerLocal(CLAVE_ID);
      const aliasLocal = leerLocal(CLAVE_ALIAS);
      let aliasRemoto: string | null = null;
      let remotoOk = false;

      if (id && supabase) {
        try {
          aliasRemoto = await obtenerAlias(id);
          remotoOk = true;
        } catch {
          // Sin conexión: se usa el alias guardado en este navegador.
        }
      }
      if (cancelado) return;

      if (id && remotoOk && aliasRemoto === null) {
        // El registro ya no existe en la base de datos: limpiamos la copia local.
        escribirLocal({ [CLAVE_ID]: null, [CLAVE_ALIAS]: null });
      }

      const encontrado = id && remotoOk ? aliasRemoto : id ? aliasLocal : null;
      if (encontrado) {
        setAlias(encontrado);
        setVerificacion("con-alias");
      } else {
        setAlias(null);
        setVerificacion("sin-alias");
      }
    }

    verificar();
    return () => {
      cancelado = true;
    };
  }, [setAlias]);

  // Tras la salida de la pantalla, la interfaz queda abierta.
  useEffect(() => {
    if (fase !== "entrando") return;
    const id = window.setTimeout(() => setFase("abierta"), DURACION_SALIDA_MS);
    return () => window.clearTimeout(id);
  }, [fase, setFase]);

  function desbloquear() {
    setFase("entrando");
  }

  async function crearRefugio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const limpio = borrador.trim().replace(/\s+/g, " ");
    if (limpio.length < ALIAS_MIN || limpio.length > ALIAS_MAX) {
      setError(`Tu apodo debe tener entre ${ALIAS_MIN} y ${ALIAS_MAX} caracteres.`);
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      const id = crypto.randomUUID();
      await crearAlias(id, limpio);
      escribirLocal({ [CLAVE_ID]: id, [CLAVE_ALIAS]: limpio });
      setAlias(limpio);
      desbloquear();
    } catch {
      setError("No pudimos crear tu refugio ahora. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (fase === "abierta") return null;

  const saliendo = fase === "entrando";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pantalla de bienvenida"
      className={`bienvenida fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-sky-400 via-cyan-300 to-teal-200 px-6 py-10 ${saliendo ? "bienvenida-salida pointer-events-none" : ""}`}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <p className="text-7xl drop-shadow-md" aria-hidden="true">🌿</p>

        {verificacion === "cargando" && (
          <p className="text-lg font-bold text-sky-950" role="status">Preparando tu espacio…</p>
        )}

        {verificacion === "con-alias" && alias && (
          <>
            <h1 className="text-3xl font-extrabold leading-tight text-sky-950 drop-shadow-sm sm:text-4xl">
              ¡Hola de nuevo, {alias}! Qué bueno verte.
            </h1>
            <button
              type="button"
              onClick={desbloquear}
              disabled={saliendo}
              className="w-full rounded-3xl border-b-[6px] border-teal-800 bg-teal-500 px-8 py-5 text-xl font-extrabold text-white shadow-lg transition active:translate-y-1 active:border-b-2 disabled:opacity-60"
            >
              Desbloquear mi espacio
            </button>
          </>
        )}

        {verificacion === "sin-alias" && (
          <>
            <h1 className="text-3xl font-extrabold leading-tight text-sky-950 drop-shadow-sm sm:text-4xl">
              ¿Cómo te gustaría que te llamemos hoy?
            </h1>
            <form onSubmit={crearRefugio} className="flex w-full flex-col gap-5">
              <label htmlFor="alias" className="sr-only">¿Cómo te gustaría que te llamemos hoy?</label>
              <input
                id="alias"
                type="text"
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
                placeholder="¿Cómo te gustaría que te llamemos hoy?"
                maxLength={ALIAS_MAX}
                autoComplete="off"
                disabled={enviando || saliendo}
                className="w-full rounded-[2rem] border-2 border-b-[6px] border-sky-200 bg-white px-6 py-5 text-center text-2xl font-bold text-sky-950 shadow-md outline-none placeholder:text-base placeholder:font-semibold placeholder:text-sky-400 focus:border-sky-500"
              />
              {error && (
                <p role="alert" className="rounded-2xl bg-rose-100 px-4 py-3 text-sm font-semibold text-rose-900">{error}</p>
              )}
              <button
                type="submit"
                disabled={enviando || saliendo}
                className="w-full rounded-3xl border-b-[6px] border-sky-800 bg-sky-600 px-8 py-5 text-xl font-extrabold text-white shadow-lg transition active:translate-y-1 active:border-b-2 disabled:opacity-60"
              >
                {enviando ? "Creando…" : "Crear mi refugio"}
              </button>
            </form>
          </>
        )}

        <p className="text-sm font-semibold text-sky-950/80">Esta herramienta apoya, no diagnostica. 100% Anónimo.</p>
      </div>
    </div>
  );
}
