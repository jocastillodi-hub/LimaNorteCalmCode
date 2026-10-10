"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import Bitacora from "@/components/Bitacora";
import Racha from "@/components/Racha";
import { useSesion } from "@/lib/session";

// Accesos del menú desplegable. Oasis y Charla salieron de la barra.
const enlaces = [
  { href: "/", icono: "💛", texto: "Mi Vibra" },
  { href: "/autocuidado", icono: "🌷", texto: "Mimos" },
  { href: "/red", icono: "🌐", texto: "Red" },
  { href: "/apoyo", icono: "🛟", texto: "Salvavidas" },
];

// Bitácora va primera en el menú; en total hay 5 botones.
const TOTAL_ITEMS = enlaces.length + 1;
const emocionesDificiles = ["tristeza", "agotamiento"];

// Cascada: al abrir, los botones salen de arriba abajo; al cerrar, la animación se invierte.
function retraso(indice: number, abierto: boolean): CSSProperties {
  const ms = abierto ? indice * 70 : (TOTAL_ITEMS - 1 - indice) * 45;
  return { transitionDelay: `${ms}ms` };
}

export default function Nav() {
  const pathname = usePathname();
  const { nocturno, setNocturno, checkin, setBitacoraAbierta } = useSesion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const necesitaApoyo = checkin !== null && emocionesDificiles.includes(checkin.emocion);

  // Escape cierra el menú.
  useEffect(() => {
    if (!menuAbierto) return;
    function alPulsarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAbierto(false);
    }
    window.addEventListener("keydown", alPulsarTecla);
    return () => window.removeEventListener("keydown", alPulsarTecla);
  }, [menuAbierto]);

  const claseItem = "flex w-full items-center gap-3 rounded-3xl border-2 border-b-4 px-4 py-3 text-base font-extrabold shadow-lg transition active:translate-y-0.5 active:border-b-2";

  return (
    <>
      <header className="panel-nav relative z-40 mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
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

      {/* Fondo oscurecido: va debajo de la barra, la cabecera y el botón SOS. */}
      <div
        aria-hidden="true"
        onClick={() => setMenuAbierto(false)}
        className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 ${menuAbierto ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <nav aria-label="Principal" className="panel-nav fixed inset-x-0 bottom-0 z-40 border-t-4 border-slate-200 bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex max-w-xl px-4 pb-3 pt-2">
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            className={`flex items-center gap-2 rounded-2xl border-2 border-b-4 px-4 py-3 font-extrabold text-white shadow-lg transition active:translate-y-0.5 active:border-b-2 ${
              menuAbierto ? "border-sky-800 bg-sky-600" : "border-sky-800 bg-sky-500"
            } ${necesitaApoyo && !menuAbierto ? "pulso-suave" : ""}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              {menuAbierto ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
            <span>Menú</span>
          </button>

          <ul
            id="menu-principal"
            inert={!menuAbierto}
            className="absolute bottom-full left-4 mb-3 flex w-[min(15rem,calc(100vw-2rem))] flex-col gap-3"
          >
            <li
              className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${menuAbierto ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"}`}
              style={retraso(0, menuAbierto)}
            >
              <button
                type="button"
                onClick={() => {
                  setBitacoraAbierta(true);
                  setMenuAbierto(false);
                }}
                aria-haspopup="dialog"
                className={`${claseItem} border-slate-200 bg-white text-slate-700`}
              >
                <span className="text-3xl" aria-hidden="true">📜</span>
                Bitácora
              </button>
            </li>
            {enlaces.map((e, i) => {
              const activo = pathname === e.href;
              const resaltar = e.href === "/apoyo" && necesitaApoyo && !activo;
              const estilo = activo
                ? "border-sky-300 bg-sky-100 text-sky-800"
                : resaltar
                  ? "pulso-suave border-orange-300 bg-orange-100 text-orange-700"
                  : "border-slate-200 bg-white text-slate-700";
              return (
                <li
                  key={e.href}
                  className={`transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${menuAbierto ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"}`}
                  style={retraso(i + 1, menuAbierto)}
                >
                  <Link
                    href={e.href}
                    aria-current={activo ? "page" : undefined}
                    onClick={() => setMenuAbierto(false)}
                    className={`${claseItem} ${estilo}`}
                  >
                    <span className="text-3xl" aria-hidden="true">{e.icono}</span>
                    {e.texto}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
