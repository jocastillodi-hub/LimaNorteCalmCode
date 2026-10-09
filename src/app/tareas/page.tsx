"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import Tarjeta from "@/components/Tarjeta";
import { crearClienteSupabase } from "@/lib/supabase/cliente";
import { AREAS, hoyISO, urgencia, validarTarea, type Area, type Tarea, type Urgencia } from "@/lib/tareas";

type Cliente = ReturnType<typeof crearClienteSupabase>;

const grupos: { clave: Urgencia; titulo: string }[] = [
  { clave: "vencida", titulo: "⏰ Pasadas de fecha" },
  { clave: "hoy", titulo: "🌤️ Para hoy" },
  { clave: "proxima", titulo: "🗓️ Próximas" },
  { clave: "sin_fecha", titulo: "🫧 Sin fecha" },
  { clave: "hecha", titulo: "✅ Hechas" },
];

export default function Tareas() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [configError, setConfigError] = useState("");
  const [usuario, setUsuario] = useState<User | null | undefined>(undefined);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setCliente(crearClienteSupabase());
    } catch (e) {
      setConfigError(e instanceof Error ? e.message : "No se pudo conectar con la base de datos.");
    }
  }, []);

  // Sesión: se lee al cargar y se actualiza cuando entra o sale el usuario.
  useEffect(() => {
    if (!cliente) return;
    cliente.auth.getUser().then(({ data }) => setUsuario(data.user ?? null));
    const { data } = cliente.auth.onAuthStateChange((_evento, sesion: Session | null) => setUsuario(sesion?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [cliente]);

  // Carga las tareas del usuario (la base de datos ya filtra por seguridad por filas).
  useEffect(() => {
    if (!cliente || !usuario) return;
    cliente
      .from("tareas")
      .select("id, titulo, area, fecha_limite, hecha, creada_en, hecha_en")
      .order("fecha_limite", { ascending: true, nullsFirst: false })
      .order("creada_en", { ascending: true })
      .then(({ data, error: e }) => {
        if (e) setError("No pudimos cargar tus tareas. Inténtalo de nuevo.");
        else setTareas((data ?? []) as Tarea[]);
      });
  }, [cliente, usuario]);

  const hoy = hoyISO();
  const porGrupo = useMemo(() => {
    const mapa: Record<Urgencia, Tarea[]> = { vencida: [], hoy: [], proxima: [], sin_fecha: [], hecha: [] };
    for (const t of tareas) mapa[urgencia(t, hoy)].push(t);
    return mapa;
  }, [tareas, hoy]);

  const aRevisar = porGrupo.vencida.length + porGrupo.hoy.length;

  if (configError) {
    return <Tarjeta><p className="text-rose-800">{configError}</p></Tarjeta>;
  }
  if (usuario === undefined || !cliente) {
    return <p className="text-center text-slate-600">Cargando tus tareas… 🫧</p>;
  }
  if (usuario === null) {
    return <InicioSesion cliente={cliente} />;
  }

  async function agregar(valor: { titulo: string; area: Area; fecha_limite: string | null }) {
    setError("");
    const { data, error: e } = await cliente!
      .from("tareas")
      .insert({ ...valor, usuario_id: usuario!.id })
      .select("id, titulo, area, fecha_limite, hecha, creada_en, hecha_en")
      .single();
    if (e || !data) setError("No se pudo guardar la tarea. Inténtalo de nuevo.");
    else setTareas((prev) => [...prev, data as Tarea]);
  }

  async function alternar(t: Tarea) {
    const hecha = !t.hecha;
    const hecha_en = hecha ? new Date().toISOString() : null;
    const { error: e } = await cliente!.from("tareas").update({ hecha, hecha_en }).eq("id", t.id);
    if (e) setError("No se pudo actualizar la tarea.");
    else setTareas((prev) => prev.map((x) => (x.id === t.id ? { ...x, hecha, hecha_en } : x)));
  }

  async function eliminar(id: string) {
    const { error: e } = await cliente!.from("tareas").delete().eq("id", id);
    if (e) setError("No se pudo borrar la tarea.");
    else setTareas((prev) => prev.filter((x) => x.id !== id));
  }

  async function borrarTodas() {
    if (!window.confirm("¿Borrar todas tus tareas? Esta acción no se puede deshacer.")) return;
    const { error: e } = await cliente!.from("tareas").delete().eq("usuario_id", usuario!.id);
    if (e) setError("No se pudieron borrar las tareas.");
    else setTareas([]);
  }

  async function salir() {
    await cliente!.auth.signOut();
    setTareas([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-sky-900">📝 Mis tareas</h1>
          <p className="text-sm text-slate-600">{usuario.email}</p>
        </div>
        <button type="button" onClick={salir} className="rounded-2xl border-b-4 border-slate-300 bg-white px-4 py-2 font-bold text-slate-700">
          Salir
        </button>
      </div>

      {aRevisar > 0 && (
        <div role="status" className="rounded-3xl border-2 border-b-4 border-amber-300 bg-amber-50 p-4 font-medium text-amber-900">
          🔔 Tienes {porGrupo.vencida.length > 0 && `${porGrupo.vencida.length} pasada(s) de fecha`}
          {porGrupo.vencida.length > 0 && porGrupo.hoy.length > 0 && " y "}
          {porGrupo.hoy.length > 0 && `${porGrupo.hoy.length} para hoy`}. Puedes moverlas cuando quieras, sin prisa.
        </div>
      )}

      <FormularioTarea onAgregar={agregar} />

      {error && <p role="alert" className="rounded-2xl bg-rose-50 px-4 py-3 text-rose-800">{error}</p>}

      {grupos.map(({ clave, titulo }) =>
        porGrupo[clave].length > 0 ? (
          <Tarjeta key={clave} titulo={titulo}>
            <ul className="flex flex-col gap-2">
              {porGrupo[clave].map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-3">
                  <input
                    type="checkbox"
                    checked={t.hecha}
                    onChange={() => alternar(t)}
                    aria-label={`Marcar como ${t.hecha ? "pendiente" : "hecha"}: ${t.titulo}`}
                    className="h-5 w-5 accent-sky-600"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-semibold ${t.hecha ? "text-slate-400 line-through" : "text-slate-800"}`}>{t.titulo}</p>
                    <p className="text-xs text-slate-500">
                      {AREAS.find((a) => a.valor === t.area)?.texto}
                      {t.fecha_limite && ` · ${t.fecha_limite}`}
                    </p>
                  </div>
                  <button type="button" onClick={() => eliminar(t.id)} className="rounded-xl px-2 py-1 text-sm text-rose-700 hover:bg-rose-50">
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          </Tarjeta>
        ) : null,
      )}

      {tareas.length === 0 && <p className="text-center text-slate-600">Aún no tienes tareas. Agrega la primera arriba 🌱</p>}

      <div className="flex justify-center">
        <button type="button" onClick={borrarTodas} disabled={tareas.length === 0} className="text-sm text-slate-600 underline disabled:invisible">
          Borrar todas mis tareas
        </button>
      </div>
    </div>
  );
}

function FormularioTarea({ onAgregar }: { onAgregar: (v: { titulo: string; area: Area; fecha_limite: string | null }) => Promise<void> }) {
  const [titulo, setTitulo] = useState("");
  const [area, setArea] = useState<Area>("otra");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const r = validarTarea({ titulo, area, fecha_limite: fecha });
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError("");
    setEnviando(true);
    await onAgregar(r.valor);
    setEnviando(false);
    setTitulo("");
    setFecha("");
  }

  return (
    <Tarjeta titulo="➕ Nueva tarea">
      <form onSubmit={enviar} className="flex flex-col gap-3" noValidate>
        <label htmlFor="titulo" className="sr-only">Nombre de la tarea</label>
        <input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej.: Enviar avance del informe"
          maxLength={120}
          className="rounded-2xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col text-sm text-slate-700">
            Área
            <select value={area} onChange={(e) => setArea(e.target.value as Area)} className="mt-1 rounded-2xl border-2 border-slate-200 bg-white px-3 py-2">
              {AREAS.map((a) => <option key={a.valor} value={a.valor}>{a.texto}</option>)}
            </select>
          </label>
          <label className="flex flex-col text-sm text-slate-700">
            Fecha límite (opcional)
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="mt-1 rounded-2xl border-2 border-slate-200 px-3 py-2" />
          </label>
        </div>
        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
        <button type="submit" disabled={enviando} className="self-start rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-2 font-bold text-white hover:bg-sky-600 disabled:opacity-60">
          {enviando ? "Guardando…" : "Agregar tarea"}
        </button>
      </form>
    </Tarjeta>
  );
}

function InicioSesion({ cliente }: { cliente: Cliente }) {
  const [email, setEmail] = useState("");
  const [consiento, setConsiento] = useState(false);
  const [estado, setEstado] = useState<"inicial" | "enviando" | "enviado" | "error">("inicial");
  const [error, setError] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!consiento) return setError("Acepta el uso de tus datos para continuar.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Escribe un correo válido.");
    setError("");
    setEstado("enviando");
    const { error: e2 } = await cliente.auth.signInWithOtp({
      email: email.trim(),
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
        <h1 className="text-3xl font-extrabold text-sky-900">📝 Mis tareas</h1>
        <p className="mt-2 text-slate-600">Guarda tus pendientes y te los recordamos. Entra con tu correo, sin contraseña.</p>
      </div>
      <Tarjeta>
        {estado === "enviado" ? (
          <p role="status" className="text-slate-800">
            Te enviamos un enlace a <strong>{email}</strong>. Ábrelo desde este mismo navegador.
          </p>
        ) : (
          <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Correo
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1 rounded-2xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={consiento} onChange={(e) => setConsiento(e.target.checked)} className="mt-1 h-4 w-4 accent-sky-600" />
              <span>
                Acepto que guardemos mis tareas y mi correo para mostrarte tus pendientes. Puedo borrar mis tareas en cualquier momento.
              </span>
            </label>
            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
            <button type="submit" disabled={estado === "enviando"} className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-3 font-bold text-white hover:bg-sky-600 disabled:opacity-60">
              {estado === "enviando" ? "Enviando…" : "Enviarme el enlace"}
            </button>
          </form>
        )}
      </Tarjeta>
      <p className="text-center text-xs text-slate-500">
        No guardamos tus respuestas emocionales junto a tus tareas.
      </p>
    </div>
  );
}
