"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Racha from "@/components/Racha";
import { enlaces } from "@/lib/navegacion";
import { useSesion } from "@/lib/session";

const emocionesDificiles = ["tristeza", "agotamiento"];

export default function Nav() {
  const pathname = usePathname();
  const { nocturno, setNocturno, checkin } = useSesion();
  const necesitaApoyo = checkin !== null && emocionesDificiles.includes(checkin.emocion);

  return (
    <header className="panel-nav relative z-10 border-b border-white/40 bg-sky-700/80 text-white backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-white">
          🌿 UCV · Bienestar
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap gap-1 text-sm">
          {enlaces.map((e) => {
            const activo = pathname === e.href;
            const resaltar = e.href === "/apoyo" && necesitaApoyo && !activo;
            return (
              <Link
                key={e.href}
                href={e.href}
                aria-current={activo ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition ${
                  activo
                    ? "bg-cyan-300 font-semibold text-sky-950 shadow"
                    : resaltar
                      ? "pulso-suave bg-orange-400/90 font-semibold text-white"
                      : "text-white hover:bg-white/20"
                }`}
              >
                {e.texto}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <Racha />
          <button
            type="button"
            role="switch"
            aria-checked={nocturno}
            onClick={() => setNocturno(!nocturno)}
            className="flex items-center gap-2 rounded-full border border-white/50 px-3 py-1.5 text-sm text-white hover:bg-white/20"
          >
            <span aria-hidden="true">{nocturno ? "🌙" : "☀️"}</span>
            <span className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${nocturno ? "bg-violet-500" : "bg-sky-200"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${nocturno ? "translate-x-4" : "translate-x-0.5"}`} />
            </span>
            <span>{nocturno ? "Noche" : "Día"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
