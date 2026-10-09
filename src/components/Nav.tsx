"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSesion } from "@/lib/session";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/check-in", texto: "Check-in" },
  { href: "/prioridades", texto: "Prioridades" },
  { href: "/pausa", texto: "Pausa" },
  { href: "/asistente", texto: "Asistente" },
  { href: "/autocuidado", texto: "Autocuidado" },
  { href: "/evaluacion", texto: "Evaluación" },
  { href: "/apoyo", texto: "Apoyo" },
];

export default function Nav() {
  const pathname = usePathname();
  const { reiniciar } = useSesion();

  return (
    <header className="border-b border-teal-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-teal-700">
          UCV · Bienestar
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
                  activo ? "bg-teal-600 text-white" : "text-teal-800 hover:bg-teal-100"
                }`}
              >
                {e.texto}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-full border border-teal-300 px-3 py-1.5 text-sm text-teal-800 hover:bg-teal-50"
        >
          Borrar sesión
        </button>
      </div>
    </header>
  );
}
