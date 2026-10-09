"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Racha from "@/components/Racha";
import { useSesion } from "@/lib/session";

// Navegación corta: lo esencial, sin repetir pantallas.
const enlaces = [
  { href: "/", texto: "💛 Cómo estoy" },
  { href: "/pausa", texto: "🫁 Pausa" },
  { href: "/asistente", texto: "💬 Asistente" },
  { href: "/autocuidado", texto: "🌷 Autocuidado" },
  { href: "/apoyo", texto: "🤍 Apoyo" },
];

export default function Nav() {
  const pathname = usePathname();
  const { reiniciar, nocturno, setNocturno } = useSesion();

  return (
    <header className="panel-nav relative z-10 border-b border-white/40 bg-sky-700/80 text-white backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-white">
          🌿 UCV · Bienestar
        </Link>
        <nav aria-label="Principal" className="flex flex-wrap gap-1 text-sm">
          {enlaces.map((e) => {
            const activo = pathname === e.href;
            return (
              <Link
                key={e.href}
                href={e.href}
                aria-current={activo ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 transition ${
                  activo ? "bg-cyan-300 font-semibold text-sky-950 shadow" : "text-white hover:bg-white/20"
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
            className="rounded-full border border-white/50 px-3 py-1.5 text-sm text-white hover:bg-white/20"
          >
            {nocturno ? "☀️ Día" : "🌙 Noche"}
          </button>
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-full border border-white/50 px-3 py-1.5 text-sm text-white hover:bg-white/20"
        >
          🧹 Borrar sesión
        </button>
        </div>
      </div>
    </header>
  );
}
