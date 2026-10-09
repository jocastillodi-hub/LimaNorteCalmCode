"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import Tarjeta from "@/components/Tarjeta";
import { crearClienteSupabase } from "@/lib/supabase/cliente";
import { DIAS, diaDeLaSemana, lunesDe, sumarDias } from "@/lib/semana";
import { AREAS, validarTarea, type Area } from "@/lib/tareas";

type Cliente = ReturnType<typeof crearClienteSupabase>;

type TareaSemana = {
  id: string;
  semana: string;
  dia: number;
  titulo: string;
  area: Area;
  proyecto: string;
  hecha: boolean;
};

const COLUMNAS = "id, semana, dia, titulo, area, proyecto, hecha";

export default function Tareas() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [configError, setConfigError] = useState("");
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [semana, setSemana] = useState(() => lunesDe());
  const [tareas, setTareas] = useState<TareaSemana[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCliente(crearClienteSupabase());
    } catch (e) {
      setConfigError(e instanceof Error ? e.message : "No se pudo conectar.");
    }
  }, []);

  // Sesión: al entrar se guarda el perfil (correo y consentimiento), una sola vez.
  useEffect(() => {
    if (!cliente) return;
    cliente.auth.getUser().then(({ data }) => setUsuario(data.user ?? null));
    const { data } = cliente.auth.onAuthStateChange((_e, sesion: Session | null) => setUsuario(sesion?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [cliente]);

  useEffect(() => {
    if (!cliente || !usuario) return;
    const consentimiento = usuario.user_metadata?.consentimiento_at as string | undefined;
    if (!consentimiento || !usuario.email) return;
    cliente
      .from("perfiles")
      .upsert({ id: usuario.id, correo: usuario.email, consentimiento_at: consentimiento }, { onConflict: "id", ignoreDuplicates: true })
      .then(({ error: e }) => {
        if (e) setError("No pudimos guardar tu perfil. Tus tareas sí se guardarán.");
      });
  }, [cliente, usuario]);

  // Tareas de la semana que se está viendo.
  useEffect(() => {
    if (!cliente || !usuario) return;
    cliente
      .from("tareas_semana")
      .select(COLUMNAS)
      .eq("semana", semana)
      .order("dia", { ascending: true })
      .order("creada_en", { ascending: true })
      .then(({ data, error: e }) => {
        if (e) setError("No pudimos cargar tus tareas. Inténtalo de nuevo.");
        else setTareas((data ?? []) as TareaSemana[]);
      });
  }, [cliente, usuario, semana]);

  const hoyDia = diaDeLaSemana();
  const esSemanaActual = semana === lunesDe();
  const porDia = useMemo(() => {
    const mapa: Record<number, TareaSemana[]> = {};
    for (const t of tareas) (mapa[t.dia] ??= []).push(t);
    return mapa;
  }, [tareas]);
  const pendientesHoy = esSemanaActual ? (porDia[hoyDia] ?? []).filter((t) => !t.hecha).length : 0;

  if (configError) return <Tarjeta><p className="text-rose-800">{configError}</p></Tarjeta>;
  if (usuario === undefined || !cliente) return <p className="text-center text-slate-600">Cargando tu semana… 🫧</p>;
  if (usuario === null) return <InicioSesion cliente={cliente} />;

  const clienteActual = cliente;
  const usuarioActual = usuario;

  async function agregar(dia: number, titulo: string, area: Area, proyecto: string) {
    const nombreProyecto = proyecto.trim() || "General";
    if (nombreProyecto.length > 60) {
      setError("El nombre del proyecto puede tener hasta 60 caracteres.");
      return;
    }
    const r = validarTarea({ titulo, area, fecha_limite: "" });
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError("");
    const { data, error: e } = await clienteActual
      .from("tareas_semana")
      .insert({ usuario_id: usuarioActual.id, semana, dia, titulo: r.valor.titulo, area: r.valor.area, proyecto: nombreProyecto })
      .select(COLUMNAS)
      .single();
    if (e || !data) setError("No se pudo guardar la tarea. Inténtalo de nuevo.");
    else setTareas((prev) => [...prev, data as TareaSemana]);
  }

  async function alternar(t: TareaSemana) {
    const hecha = !t.hecha;
    const { error: e } = await clienteActual
      .from("tareas_semana")
      .update({ hecha, hecha_en: hecha ? new Date().toISOString() : null })
      .eq("id", t.id);
    if (e) setError("No se pudo actualizar la tarea.");
    else setTareas((prev) => prev.map((x) => (x.id === t.id ? { ...x, hecha } : x)));
  }

  async function eliminar(id: string) {
    const { error: e } = await clienteActual.from("tareas_semana").delete().eq("id", id);
    if (e) setError("No se pudo borrar la tarea.");
    else setTareas((prev) => prev.filter((x) => x.id !== id));
  }

  async function salir() {
    await clienteActual.auth.signOut();
    setTareas([]);
  }

  const etiquetaSemana = `${semana.split("-").reverse().join("/")} al ${sumarDias(semana, 6).split("-").reverse().join("/")}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-sky-900">📅 Mi semana</h1>
          <p className="text-sm text-slate-600">{usuarioActual.email}</p>
        </div>
        <button type="button" onClick={salir} className="rounded-2xl border-b-4 border-slate-300 bg-white px-4 py-2 font-bold text-slate-700">Salir</button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-3">
        <button type="button" onClick={() => setSemana(sumarDias(semana, -7))} className="rounded-xl px-3 py-2 font-bold text-sky-800 hover:bg-sky-50">◀ Anterior</button>
        <div className="text-center">
          <p className="font-bold text-slate-800">{etiquetaSemana}</p>
          {!esSemanaActual && (
            <button type="button" onClick={() => setSemana(lunesDe())} className="text-sm text-sky-700 underline">Volver a esta semana</button>
          )}
        </div>
        <button type="button" onClick={() => setSemana(sumarDias(semana, 7))} className="rounded-xl px-3 py-2 font-bold text-sky-800 hover:bg-sky-50">Siguiente ▶</button>
      </div>

      {pendientesHoy > 0 && (
        <div role="status" className="rounded-3xl border-2 border-b-4 border-amber-300 bg-amber-50 p-4 font-medium text-amber-900">
          🔔 Hoy te quedan {pendientesHoy} tarea(s) pendiente(s). Puedes avanzar a tu ritmo.
        </div>
      )}

      {error && <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-800">{error}</p>}

      <TablaSemanal
        tareas={tareas}
        semana={semana}
        hoyDia={esSemanaActual ? hoyDia : 0}
        onAgregar={agregar}
        onAlternar={alternar}
        onEliminar={eliminar}
      />
    </div>
  );
}

// Tabla: cada fila es una tarea de un proyecto; cada columna es un día de la semana.
function TablaSemanal({
  tareas,
  semana,
  hoyDia,
  onAgregar,
  onAlternar,
  onEliminar,
}: {
  tareas: TareaSemana[];
  semana: string;
  hoyDia: number;
  onAgregar: (dia: number, titulo: string, area: Area, proyecto: string) => void;
  onAlternar: (t: TareaSemana) => void;
  onEliminar: (id: string) => void;
}) {
  const filas = useMemo(() => {
    const mapa = new Map<string, { clave: string; proyecto: string; titulo: string; area: Area; porDia: Record<number, TareaSemana> }>();
    for (const t of tareas) {
      const clave = `${t.proyecto}\u0000${t.titulo}`;
      if (!mapa.has(clave)) mapa.set(clave, { clave, proyecto: t.proyecto, titulo: t.titulo, area: t.area, porDia: {} });
      mapa.get(clave)!.porDia[t.dia] = t;
    }
    return [...mapa.values()];
  }, [tareas]);

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-3xl border-2 border-b-4 border-slate-200 bg-white">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <caption className="sr-only">Tareas de la semana por proyecto y día</caption>
          <thead>
            <tr className="bg-sky-50 text-left text-slate-700">
              <th scope="col" className="sticky left-0 z-10 bg-sky-50 px-3 py-3">Proyecto</th>
              <th scope="col" className="px-3 py-3">Tarea</th>
              {DIAS.map((d) => (
                <th
                  key={d.numero}
                  scope="col"
                  className={`px-2 py-3 text-center ${d.numero === hoyDia ? "bg-sky-200 font-extrabold text-sky-900" : ""}`}
                >
                  <span className="block">{d.nombre.slice(0, 3)}</span>
                  <span className="block text-xs font-normal text-slate-500">{sumarDias(semana, d.numero - 1).split("-").reverse().slice(0, 2).join("/")}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-6 text-center text-slate-500">Aún no hay tareas esta semana. Agrega una abajo 🌱</td>
              </tr>
            )}
            {filas.map((f) => (
              <tr key={f.clave} className="border-t border-slate-200">
                <td className="sticky left-0 z-10 bg-white px-3 py-2 font-semibold text-slate-600">{f.proyecto}</td>
                <td className="px-3 py-2 font-bold text-slate-800">{AREAS.find((a) => a.valor === f.area)?.texto.split(" ")[0]} {f.titulo}</td>
                {DIAS.map((d) => {
                  const t = f.porDia[d.numero];
                  return (
                    <td key={d.numero} className={`px-2 py-2 text-center ${d.numero === hoyDia ? "bg-sky-50" : ""}`}>
                      {t ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="checkbox"
                            checked={t.hecha}
                            onChange={() => onAlternar(t)}
                            aria-label={`${f.titulo} el ${d.nombre}: ${t.hecha ? "hecha" : "pendiente"}`}
                            className="h-5 w-5 accent-sky-600"
                          />
                          <button type="button" onClick={() => onEliminar(t.id)} aria-label={`Borrar ${f.titulo} del ${d.nombre}`} className="rounded px-1 text-rose-600 hover:bg-rose-50">✕</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAgregar(d.numero, f.titulo, f.area, f.proyecto)}
                          aria-label={`Añadir ${f.titulo} el ${d.nombre}`}
                          className="h-7 w-7 rounded-full border-2 border-dashed border-slate-300 text-slate-400 hover:border-sky-400 hover:text-sky-600"
                        >
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FilaNueva hoyDia={hoyDia || 1} onAgregar={(dia, titulo, area, proyecto) => onAgregar(dia, titulo, area, proyecto)} />
    </div>
  );
}

function FilaNueva({ hoyDia, onAgregar }: { hoyDia: number; onAgregar: (dia: number, titulo: string, area: Area, proyecto: string) => void }) {
  const [proyecto, setProyecto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState<Area>("otra");
  const [dia, setDia] = useState(hoyDia);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!titulo.trim()) return;
        onAgregar(dia, titulo, area, proyecto);
        setTitulo("");
      }}
      className="grid gap-3 rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      <p className="text-sm font-bold text-slate-700 lg:col-span-5">➕ Nueva fila</p>
      <label className="flex flex-col text-xs font-semibold text-slate-600">
        Proyecto
        <input value={proyecto} onChange={(e) => setProyecto(e.target.value)} maxLength={60} placeholder="General" className="mt-1 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-normal" />
      </label>
      <label className="flex flex-col text-xs font-semibold text-slate-600 sm:col-span-1">
        Tarea
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={120} placeholder="Ej.: Redactar capítulo 2" className="mt-1 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-normal" />
      </label>
      <label className="flex flex-col text-xs font-semibold text-slate-600">
        Área
        <select value={area} onChange={(e) => setArea(e.target.value as Area)} className="mt-1 rounded-xl border-2 border-slate-200 bg-white px-2 py-2 text-sm font-normal">
          {AREAS.map((a) => <option key={a.valor} value={a.valor}>{a.texto}</option>)}
        </select>
      </label>
      <label className="flex flex-col text-xs font-semibold text-slate-600">
        Día
        <select value={dia} onChange={(e) => setDia(Number(e.target.value))} className="mt-1 rounded-xl border-2 border-slate-200 bg-white px-2 py-2 text-sm font-normal">
          {DIAS.map((d) => <option key={d.numero} value={d.numero}>{d.nombre}</option>)}
        </select>
      </label>
      <button type="submit" className="self-end rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 font-bold text-white hover:bg-sky-600">Añadir</button>
    </form>
  );
}

function InicioSesion({ cliente }: { cliente: Cliente }) {
  const [correo, setCorreo] = useState("");
  const [consiento, setConsiento] = useState(false);
  const [estado, setEstado] = useState<"inicial" | "enviando" | "enviado" | "error">("inicial");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!consiento) return setError("Acepta el uso de tus datos para continuar.");
    if (!/^\S+@\S+\.\S+$/.test(correo.trim())) return setError("Escribe un correo válido.");
    setError("");
    setEstado("enviando");
    const { error: e2 } = await cliente.auth.signInWithOtp({
      email: correo.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { consentimiento_at: new Date().toISOString() },
      },
    });
    if (e2) {
      setEstado("error");
      setError("No pudimos enviar el enlace. Revisa el correo e inténtalo de nuevo.");
    } else setEstado("enviado");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-sky-900">📅 Mi semana</h1>
        <p className="mt-2 text-slate-600">Organiza tus tareas de lunes a domingo. Entra con tu correo, sin contraseña.</p>
      </div>
      <Tarjeta>
        {estado === "enviado" ? (
          <p role="status" className="text-slate-800">Te enviamos un enlace a <strong>{correo}</strong>. Ábrelo desde este mismo navegador.</p>
        ) : (
          <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Correo
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" className="mt-1 rounded-2xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-sky-400" />
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={consiento} onChange={(e) => setConsiento(e.target.checked)} className="mt-1 h-4 w-4 accent-sky-600" />
              <span>Acepto que guardemos mi correo y mis tareas para mostrarte mi semana. Puedo borrar mis tareas en cualquier momento.</span>
            </label>
            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
            <button type="submit" disabled={estado === "enviando"} className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-3 font-bold text-white hover:bg-sky-600 disabled:opacity-60">
              {estado === "enviando" ? "Enviando…" : "Enviarme el enlace"}
            </button>
          </form>
        )}
      </Tarjeta>
    </div>
  );
}
