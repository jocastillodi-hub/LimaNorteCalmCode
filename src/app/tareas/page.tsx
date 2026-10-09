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
  hecha: boolean;
};

const COLUMNAS = "id, semana, dia, titulo, area, hecha";

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

  async function agregar(dia: number, titulo: string, area: Area) {
    const r = validarTarea({ titulo, area, fecha_limite: "" });
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError("");
    const { data, error: e } = await clienteActual
      .from("tareas_semana")
      .insert({ usuario_id: usuarioActual.id, semana, dia, titulo: r.valor.titulo, area: r.valor.area })
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DIAS.map((d) => {
          const esHoy = esSemanaActual && d.numero === hoyDia;
          const fecha = sumarDias(semana, d.numero - 1).split("-").reverse().slice(0, 2).join("/");
          return (
            <section
              key={d.numero}
              aria-labelledby={`dia-${d.numero}`}
              className={`flex flex-col gap-3 rounded-3xl border-2 border-b-4 p-4 ${esHoy ? "border-sky-400 bg-sky-50" : "border-slate-200 bg-white"}`}
            >
              <h2 id={`dia-${d.numero}`} className="flex items-baseline justify-between font-extrabold text-slate-800">
                {d.nombre}
                <span className="text-xs font-semibold text-slate-500">{fecha}{esHoy && " · hoy"}</span>
              </h2>
              <ul className="flex flex-col gap-2">
                {(porDia[d.numero] ?? []).map((t) => (
                  <li key={t.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2">
                    <input
                      type="checkbox"
                      checked={t.hecha}
                      onChange={() => alternar(t)}
                      aria-label={`Marcar como ${t.hecha ? "pendiente" : "hecha"}: ${t.titulo}`}
                      className="h-5 w-5 shrink-0 accent-sky-600"
                    />
                    <span className={`min-w-0 flex-1 truncate text-sm ${t.hecha ? "text-slate-400 line-through" : "text-slate-800"}`}>
                      {AREAS.find((a) => a.valor === t.area)?.texto.split(" ")[0]} {t.titulo}
                    </span>
                    <button type="button" onClick={() => eliminar(t.id)} aria-label={`Borrar ${t.titulo}`} className="shrink-0 rounded-lg px-1 text-rose-700 hover:bg-rose-50">✕</button>
                  </li>
                ))}
              </ul>
              <NuevaTarea onAgregar={(titulo, area) => agregar(d.numero, titulo, area)} dia={d.nombre} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

function NuevaTarea({ onAgregar, dia }: { onAgregar: (titulo: string, area: Area) => void; dia: string }) {
  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState<Area>("otra");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!titulo.trim()) return;
        onAgregar(titulo, area);
        setTitulo("");
      }}
      className="mt-auto flex flex-col gap-2"
    >
      <label htmlFor={`nueva-${dia}`} className="sr-only">Nueva tarea para el {dia}</label>
      <input
        id={`nueva-${dia}`}
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={120}
        placeholder="+ Nueva tarea"
        className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
      />
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={`area-${dia}`}>Área</label>
        <select id={`area-${dia}`} value={area} onChange={(e) => setArea(e.target.value as Area)} className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 bg-white px-2 py-1 text-sm">
          {AREAS.map((a) => <option key={a.valor} value={a.valor}>{a.texto}</option>)}
        </select>
        <button type="submit" className="rounded-xl border-b-4 border-sky-700 bg-sky-500 px-3 py-1 text-sm font-bold text-white hover:bg-sky-600">Añadir</button>
      </div>
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
