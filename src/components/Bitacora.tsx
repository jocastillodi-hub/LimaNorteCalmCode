"use client";

import { useEffect, useState } from "react";
import CalendarioPastel from "@/components/CalendarioPastel";
import { dividirEnPasos, estadoTiempo, mensajeCarga, nivelCarga, pendientesDelDia, progreso, type Mision } from "@/lib/bitacora";
import { etiquetaDia, etiquetaFecha, lunesDe, sumarDias } from "@/lib/fechas";
import { useSesion } from "@/lib/session";

const COLOR_CARGA = { libre: "bg-emerald-300", suave: "bg-amber-300", llena: "bg-rose-300" } as const;

function generarId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Hora local del selector (AAAA-MM-DDTHH:mm) <-> ISO.
function horaAIso(local: string) {
  return local ? new Date(local).toISOString() : null;
}
function isoAHora(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function textoHora(iso: string) {
  return new Date(iso).toLocaleString("es-PE", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

type Borrador = { titulo: string; fecha: string; calendarioAbierto: boolean };

// Modal con el planificador. Cada columna es un día con fecha exacta.
// Las misiones se guardan con su fecha y aparecen al navegar hasta esa semana.
export default function Bitacora() {
  const { misiones, setMisiones, guardarBitacora, setGuardarBitacora, bitacoraAbierta: abierta, setBitacoraAbierta } = useSesion();
  const onCerrar = () => setBitacoraAbierta(false);
  const [semana, setSemana] = useState(() => lunesDe());
  const [expandida, setExpandida] = useState<string | null>(null);
  const [horaAbierta, setHoraAbierta] = useState<string | null>(null);
  const [pasosTexto, setPasosTexto] = useState("");
  const [borradores, setBorradores] = useState<Record<string, Borrador>>({});
  const [aviso, setAviso] = useState<{ texto: string; fecha: string } | null>(null);

  useEffect(() => {
    if (!abierta) return;
    function alTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") setBitacoraAbierta(false);
    }
    window.addEventListener("keydown", alTeclar);
    return () => window.removeEventListener("keydown", alTeclar);
  }, [abierta, setBitacoraAbierta]);

  if (!abierta) return null;

  const dias = Array.from({ length: 7 }, (_, i) => sumarDias(semana, i));
  const resumen = progreso(misiones);
  const burbujas = 10;
  const llenas = Math.round((resumen.porcentaje / 100) * burbujas);
  const rango = `${dias[0].split("-").reverse().join("/")} – ${dias[6].split("-").reverse().join("/")}`;

  function borrador(dia: string): Borrador {
    return borradores[dia] ?? { titulo: "", fecha: dia, calendarioAbierto: false };
  }
  function cambiarBorrador(dia: string, cambios: Partial<Borrador>) {
    setBorradores((b) => ({ ...b, [dia]: { ...borrador(dia), ...cambios } }));
  }

  function agregar(columna: string) {
    const b = borrador(columna);
    const titulo = b.titulo.trim();
    if (!titulo) return;
    const nueva: Mision = { id: generarId(), titulo: titulo.slice(0, 120), fecha: b.fecha, hecha: false, pasos: [], vence: null };
    setMisiones((prev) => [...prev, nueva]);
    cambiarBorrador(columna, { titulo: "", calendarioAbierto: false });
    const fueraDeEstaSemana = !dias.includes(b.fecha);
    setAviso(
      fueraDeEstaSemana ? { texto: `Guardada para el ${etiquetaFecha(b.fecha)}. Aparecerá cuando llegues a esa semana.`, fecha: b.fecha } : null,
    );
  }

  function irAFecha(fecha: string) {
    setSemana(lunesDe(fecha));
    setAviso(null);
  }

  function cambiarHora(id: string, local: string) {
    setMisiones((prev) => prev.map((m) => (m.id === id ? { ...m, vence: horaAIso(local) } : m)));
  }
  function alternar(id: string) {
    setMisiones((prev) => prev.map((m) => (m.id === id ? { ...m, hecha: !m.hecha } : m)));
  }
  // Mover al día siguiente no tiene penalización: la hora anterior se quita.
  function moverAManana(id: string) {
    setMisiones((prev) => prev.map((m) => (m.id === id ? { ...m, fecha: sumarDias(m.fecha, 1), vence: null } : m)));
  }
  function eliminar(id: string) {
    setMisiones((prev) => prev.filter((m) => m.id !== id));
  }
  function dividir(mision: Mision) {
    const pasos = dividirEnPasos(pasosTexto, generarId);
    if (pasos.length === 0) return;
    setMisiones((prev) => prev.map((m) => (m.id === mision.id ? { ...m, pasos: [...m.pasos, ...pasos].slice(0, 6) } : m)));
    setPasosTexto("");
  }
  function alternarPaso(misionId: string, pasoId: string) {
    setMisiones((prev) =>
      prev.map((m) => (m.id === misionId ? { ...m, pasos: m.pasos.map((p) => (p.id === pasoId ? { ...p, hecha: !p.hecha } : p)) } : m)),
    );
  }
  function borrarTodo() {
    if (!window.confirm("¿Borrar toda la bitácora? No se puede deshacer.")) return;
    setMisiones([]);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-sky-950/40 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div role="dialog" aria-modal="true" aria-labelledby="titulo-bitacora" className="entrada flex max-h-[92dvh] w-full max-w-6xl flex-col gap-5 overflow-y-auto rounded-t-[2.5rem] bg-sky-50 p-5 shadow-2xl sm:rounded-[2.5rem] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="titulo-bitacora" className="text-2xl font-extrabold text-sky-900">📜 Bitácora de la semana</h2>
            <p className="text-sm text-slate-600">Un paso a la vez. Nada aquí es una obligación.</p>
          </div>
          <button type="button" onClick={onCerrar} className="rounded-2xl border-b-4 border-slate-300 bg-white px-3 py-1 font-bold text-slate-700">Cerrar</button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/80 p-3">
          <button type="button" onClick={() => setSemana(sumarDias(semana, -7))} className="flex items-center gap-1 rounded-full bg-amber-100 px-4 py-2 font-bold text-amber-900 hover:bg-amber-200" aria-label="Semana anterior">
            <span aria-hidden="true">🐌</span> Anterior
          </button>
          <div className="text-center">
            <p className="font-extrabold text-slate-800">{rango}</p>
            {semana !== lunesDe() && (
              <button type="button" onClick={() => setSemana(lunesDe())} className="text-xs font-bold text-sky-700 underline">Volver a esta semana</button>
            )}
          </div>
          <button type="button" onClick={() => setSemana(sumarDias(semana, 7))} className="flex items-center gap-1 rounded-full bg-amber-100 px-4 py-2 font-bold text-amber-900 hover:bg-amber-200" aria-label="Semana siguiente">
            Siguiente <span aria-hidden="true">⭐</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-white/80 p-4">
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: burbujas }, (_, i) => (
              <span key={i} className={`h-5 w-5 rounded-full border-2 transition-all duration-700 ${i < llenas ? "border-sky-400 bg-sky-300 shadow-inner" : "border-sky-200 bg-white"}`} />
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-700" aria-live="polite">
            {resumen.total === 0 ? "Agrega tu primera misión 🐚" : `${resumen.hechas} de ${resumen.total} listas (${resumen.porcentaje}%)`}
          </p>
        </div>

        {aviso && (
          <p role="status" className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {aviso.texto}{" "}
            <button type="button" onClick={() => irAFecha(aviso.fecha)} className="underline">Ir a esa semana</button>
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dias.map((fecha) => {
            const pendientes = pendientesDelDia(misiones, fecha);
            const nivel = nivelCarga(pendientes);
            const avisoCarga = mensajeCarga(nivel, etiquetaDia(fecha).split(",")[0]);
            const delDia = misiones.filter((m) => m.fecha === fecha);
            const b = borrador(fecha);
            return (
              <section key={fecha} aria-label={etiquetaDia(fecha)} className="esponja flex flex-col gap-3 rounded-3xl border-2 border-b-4 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 p-4 shadow-sm">
                <div>
                  <h3 className="font-extrabold leading-tight text-amber-950">{etiquetaDia(fecha)}</h3>
                  <p className="text-xs font-semibold text-amber-900/70">{pendientes} pendiente(s)</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/70" role="img" aria-label={`Carga del día: ${nivel}`}>
                  <div className={`h-full rounded-full transition-all duration-700 ${COLOR_CARGA[nivel]}`} style={{ width: `${Math.min(100, (pendientes / 5) * 100)}%` }} />
                </div>
                {avisoCarga && <p role="status" className="rounded-2xl bg-white/80 px-3 py-2 text-xs text-amber-900">{avisoCarga}</p>}

                <ul className="flex flex-col gap-2">
                  {delDia.map((m) => {
                    const tiempo = estadoTiempo(m);
                    const pronto = tiempo === "pronto";
                    return (
                      <li key={m.id} className={`relative overflow-hidden rounded-2xl p-3 shadow-sm transition-colors duration-700 ${pronto ? "bg-amber-100" : "bg-white"}`}>
                        {pronto && <span aria-hidden="true" className="burbuja-soltar pointer-events-none absolute bottom-1 right-3 h-2 w-2 rounded-full bg-amber-300/80" />}
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={m.hecha} onChange={() => alternar(m.id)} aria-label={`Lista: ${m.titulo}`} className="h-5 w-5 shrink-0 accent-sky-600" />
                          <span className={`min-w-0 flex-1 text-sm font-semibold ${m.hecha ? "text-slate-400 line-through" : "text-slate-800"}`}>{m.titulo}</span>
                          <button type="button" onClick={() => setHoraAbierta(horaAbierta === m.id ? null : m.id)} aria-label={m.vence ? `Cambiar hora de ${m.titulo}` : `Poner hora a ${m.titulo}`} className="shrink-0 text-base">
                            {m.vence ? "⏳" : "🌙"}
                          </button>
                          <button type="button" onClick={() => setExpandida(expandida === m.id ? null : m.id)} className="shrink-0 text-xs font-bold text-sky-700" aria-expanded={expandida === m.id}>🐌</button>
                        </div>

                        {m.vence && (
                          <p className="mt-1 pl-7 text-xs text-slate-500">
                            {tiempo === "esperando" ? "Esperando su turno 🐢" : pronto ? "Falta poco, sin prisa 🌅" : `Para ${textoHora(m.vence)}`}
                          </p>
                        )}

                        {horaAbierta === m.id && (
                          <div className="mt-2 flex items-center gap-2 pl-7">
                            <label htmlFor={`hora-${m.id}`} className="text-xs text-slate-600">Hora opcional</label>
                            <input id={`hora-${m.id}`} type="datetime-local" value={isoAHora(m.vence)} onChange={(e) => cambiarHora(m.id, e.target.value)} className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-2 py-1 text-xs" />
                            {m.vence && <button type="button" onClick={() => cambiarHora(m.id, "")} className="text-xs text-slate-500 underline">Quitar</button>}
                          </div>
                        )}

                        {expandida === m.id && (
                          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                            {m.pasos.length > 0 && <p className="text-xs text-slate-500">{m.pasos.filter((p) => p.hecha).length} de {m.pasos.length} pasos</p>}
                            <ul className="flex flex-col gap-1">
                              {m.pasos.map((p) => (
                                <li key={p.id} className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={p.hecha} onChange={() => alternarPaso(m.id, p.id)} aria-label={`Paso: ${p.texto}`} className="h-4 w-4 accent-sky-600" />
                                  <span className={p.hecha ? "text-slate-400 line-through" : "text-slate-700"}>{p.texto}</span>
                                </li>
                              ))}
                            </ul>
                            {m.pasos.length < 6 && (
                              <div className="flex gap-2">
                                <input value={pasosTexto} onChange={(e) => setPasosTexto(e.target.value)} placeholder="abrir, escribir, revisar" aria-label="Pasos separados por comas" className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-2 py-1 text-xs" />
                                <button type="button" onClick={() => dividir(m)} className="rounded-xl bg-sky-500 px-2 py-1 text-xs font-bold text-white">Dividir</button>
                              </div>
                            )}
                            <div className="flex justify-between text-xs">
                              <button type="button" onClick={() => moverAManana(m.id)} className="font-bold text-sky-700">→ Mañana</button>
                              <button type="button" onClick={() => eliminar(m.id)} className="font-bold text-rose-700">Quitar</button>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <form onSubmit={(e) => { e.preventDefault(); agregar(fecha); }} className="mt-auto flex flex-col gap-2">
                  <div className="flex gap-2">
                    <label htmlFor={`mision-${fecha}`} className="sr-only">Nueva misión para {etiquetaDia(fecha)}</label>
                    <input
                      id={`mision-${fecha}`}
                      value={b.titulo}
                      onChange={(e) => cambiarBorrador(fecha, { titulo: e.target.value })}
                      maxLength={120}
                      placeholder="+ Nueva misión"
                      className="min-w-0 flex-1 rounded-xl border-2 border-white bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-300"
                    />
                    <button type="button" onClick={() => cambiarBorrador(fecha, { calendarioAbierto: !b.calendarioAbierto })} aria-expanded={b.calendarioAbierto} aria-label="Elegir fecha" className="rounded-xl bg-white px-2 text-lg shadow-sm">📅</button>
                  </div>
                  <p className="text-xs text-amber-900/80">Aparecerá el {etiquetaFecha(b.fecha)}</p>
                  {b.calendarioAbierto && (
                    <CalendarioPastel valor={b.fecha} onElegir={(iso) => cambiarBorrador(fecha, { fecha: iso, calendarioAbierto: false })} />
                  )}
                </form>
              </section>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/80 p-4 text-sm">
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" checked={guardarBitacora} onChange={(e) => setGuardarBitacora(e.target.checked)} className="h-4 w-4 accent-sky-600" />
            Guardar en este navegador (apagado: se pierde al recargar)
          </label>
          <button type="button" onClick={borrarTodo} disabled={misiones.length === 0} className="font-bold text-rose-700 disabled:opacity-40">Borrar toda la bitácora</button>
        </div>
      </div>
    </div>
  );
}
