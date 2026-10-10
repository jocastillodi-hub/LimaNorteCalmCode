"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import Bitacora from "@/components/Bitacora";
import Racha from "@/components/Racha";
import { alternarSilencio, useControlesMusica, useSilenciada } from "@/lib/musica";
import { useSesion } from "@/lib/session";

// Accesos del menú desplegable de la cabecera. Oasis y Charla salieron de la navegación.
const enlaces = [
  { href: "/autocuidado", imagen: "/perla.png", texto: "Mimos", animacion: "mascota-pop" },
  { href: "/diversion", imagen: "/esponjoso.png", texto: "Rato de juego", animacion: "mascota-salto" },
  { href: "/red", imagen: "/pratricko.png", texto: "Material Educativo", animacion: "mascota-brinco" },
  { href: "/apoyo", imagen: "/pulpita.png", texto: "Salvavidas", animacion: "mascota-inflar" },
];
const DURACION_MASCOTA_MS = 650;

// Bitácora va primera en el menú; en total hay 4 botones.
const TOTAL_ITEMS = enlaces.length + 1;
const emocionesDificiles = ["triste", "agotado"];

// Cascada: al abrir, los botones bajan uno tras otro; al cerrar, la secuencia se invierte.
function retraso(indice: number, abierto: boolean): CSSProperties {
  const ms = abierto ? indice * 70 : (TOTAL_ITEMS - 1 - indice) * 45;
  return { transitionDelay: `${ms}ms` };
}

export default function Nav() {
  const pathname = usePathname();
  const { nocturno, setNocturno, checkin, setBitacoraAbierta } = useSesion();
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);
  // Opción cuya mascota se está animando (null = ninguna).
  const [elegida, setElegida] = useState<string | null>(null);
  const necesitaApoyo = checkin !== null && emocionesDificiles.includes(checkin.emocion);
  const silenciada = useSilenciada();
  useControlesMusica();

  // Escape cierra el menú.
  useEffect(() => {
    if (!menuAbierto) return;
    function alPulsarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAbierto(false);
    }
    window.addEventListener("keydown", alPulsarTecla);
    return () => window.removeEventListener("keydown", alPulsarTecla);
  }, [menuAbierto]);

  // Anima la mascota elegida y, al terminar, cierra el menú y ejecuta la acción.
  function elegir(clave: string, accion: () => void) {
    if (elegida) return;
    setElegida(clave);
    const espera = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : DURACION_MASCOTA_MS;
    window.setTimeout(() => {
      setMenuAbierto(false);
      setElegida(null);
      accion();
    }, espera);
  }

  const claseItem = "flex w-full items-center gap-3 rounded-3xl border-2 border-b-4 px-4 py-3 text-base font-extrabold shadow-lg transition active:translate-y-0.5 active:border-b-2";
  const claseVisible = (abierto: boolean) =>
    `transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${abierto ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-3 scale-90 opacity-0"}`;

  return (
    <>
      <header className="panel-nav relative z-40 mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap font-bold text-slate-800">
          <span>🌱</span>
          <span>UCV - NEXUM</span>
        </Link>
        <div className="relative flex items-center gap-2">
          <Racha />
          <button
            type="button"
            role="switch"
            aria-label="Modo noche"
            aria-checked={nocturno}
            onClick={() => setNocturno(!nocturno)}
            className="flex items-center gap-2 rounded-full border-2 border-b-4 border-sky-200 bg-white px-3 py-1.5 text-sm font-bold text-sky-900"
          >
            <span aria-hidden="true">{nocturno ? "🌙" : "☀️"}</span>
            <span className="hidden sm:inline">{nocturno ? "Noche" : "Día"}</span>
          </button>
          <button
            type="button"
            onClick={alternarSilencio}
            aria-pressed={silenciada}
            aria-label={silenciada ? "Activar música" : "Silenciar música"}
            title="Tecla M: silenciar o activar"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-sky-200 bg-white text-xl shadow transition active:translate-y-0.5 active:border-b-2"
          >
            <span aria-hidden="true">{silenciada ? "🔇" : "🔊"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-expanded={menuAbierto}
            aria-controls="menu-cabecera"
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-sky-800 text-white shadow-lg transition active:translate-y-0.5 active:border-b-2 ${
              menuAbierto ? "bg-sky-600" : "bg-sky-500"
            } ${necesitaApoyo && !menuAbierto ? "pulso-suave" : ""}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
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
          </button>

          <ul
            id="menu-cabecera"
            inert={!menuAbierto}
            className="absolute right-0 top-full z-50 mt-3 flex w-[min(15rem,calc(100vw-2rem))] flex-col gap-3"
          >
            <li className={claseVisible(menuAbierto)} style={retraso(0, menuAbierto)}>
              <button
                type="button"
                onClick={() => elegir("bitacora", () => setBitacoraAbierta(true))}
                aria-haspopup="dialog"
                className={`${claseItem} border-slate-200 bg-white text-slate-700`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/piñita.png" alt="" aria-hidden="true" className={`relative z-10 h-7 w-7 object-contain ${elegida === "bitacora" ? "mascota-salto" : ""}`} />
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
                <li key={e.href} className={claseVisible(menuAbierto)} style={retraso(i + 1, menuAbierto)}>
                  <Link
                    href={e.href}
                    aria-current={activo ? "page" : undefined}
                    onClick={(ev) => {
                      ev.preventDefault();
                      elegir(e.href, () => router.push(e.href));
                    }}
                    className={`${claseItem} ${estilo}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.imagen} alt="" aria-hidden="true" className={`relative z-10 h-7 w-7 object-contain ${elegida === e.href ? e.animacion : ""}`} />
                    {e.texto}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      <Bitacora />

      {/* Fondo oscurecido: va debajo de la cabecera y del botón SOS. */}
      <div
        aria-hidden="true"
        onClick={() => setMenuAbierto(false)}
        className={`fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 ${menuAbierto ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
    </>
  );
}
