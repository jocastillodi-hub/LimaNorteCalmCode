"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import Bitacora from "@/components/Bitacora";
import Racha from "@/components/Racha";
import { useSesion } from "@/lib/session";

// Barra inferior fija con íconos grandes. Los nombres son cálidos a propósito.
const enlaces = [
  { href: "/", icono: "💛", texto: "Mi Clima Interno" },
  { href: "/pausa", icono: "🫧", texto: "Oasis" },
  { href: "/asistente", icono: "💬", texto: "Charla" },
  { href: "/autocuidado", icono: "🌷", texto: "Mimos" },
  { href: "/red", icono: "🌐", texto: "Red" },
  { href: "/apoyo", icono: "🛟", texto: "Salvavidas" },
];

const emocionesDificiles = ["tristeza", "agotamiento"];

export default function Nav() {
  const pathname = usePathname();
  const { nocturno, setNocturno, checkin, setBitacoraAbierta } = useSesion();
  const necesitaApoyo = checkin !== null && emocionesDificiles.includes(checkin.emocion);

  return (
    <>
      <header data-reveal className="panel-nav relative z-10 mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-extrabold text-sky-900">🌿 UCV · Bienestar</Link>
        <div className="flex items-center gap-2">
          <Racha />
          <button
            type="button"
            role="switch"
            aria-checked={nocturno}
            onClick={() => setNocturno(!nocturno)}
            className="flex items-center gap-2 rounded-full border-2 border-b-4 border-sky-200 bg-white px-3 py-1.5 text-sm font-bold text-sky-900"
          >
            <span aria-hidden="true">{nocturno ? "🌙" : "☀️"}</span>
            <span>{nocturno ? "Noche" : "Día"}</span>
          </button>
        </div>
      </header>

      <Bitacora />

      <nav aria-label="Principal" className="panel-nav fixed inset-x-0 bottom-0 z-40 border-t-4 border-slate-200 bg-white/95 backdrop-blur">
        <ul className="mx-auto flex max-w-xl justify-around px-2 pb-2 pt-2">
          <li data-reveal style={{ "--i": 1 } as CSSProperties}>
            <button
              type="button"
              onClick={() => setBitacoraAbierta(true)}
              aria-haspopup="dialog"
              className="flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 active:translate-y-0.5"
            >
              <span className="text-3xl" aria-hidden="true">📜</span>
              Bitácora
            </button>
          </li>
          {enlaces.map((e, i) => {
            const activo = pathname === e.href;
            const resaltar = e.href === "/apoyo" && necesitaApoyo && !activo;
            return (
              <li key={e.href} data-reveal style={{ "--i": i + 2 } as CSSProperties}>
                <Link
                  href={e.href}
                  aria-current={activo ? "page" : undefined}
                  className={`flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-xs font-bold transition active:translate-y-0.5 ${
                    activo
                      ? "bg-sky-100 text-sky-800"
                      : resaltar
                        ? "pulso-suave bg-orange-100 text-orange-700"
                        : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-3xl" aria-hidden="true">{e.icono}</span>
                  {e.texto}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
