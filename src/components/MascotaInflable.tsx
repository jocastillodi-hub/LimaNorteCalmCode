"use client";

import { useState } from "react";

// Imagen de la mascota. Pon tu propia imagen (con licencia) en public/mascota-flotador.png.
// Mientras no exista, se muestra una figura original en SVG.
export const MASCOTA_SRC = "/mascota-flotador.png";

const COLORES_CONFETI = ["#fde047", "#f472b6", "#67e8f9", "#a78bfa", "#86efac", "#fb923c"];

function FiguraOriginal() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {/* Cuerpo */}
      <ellipse cx="100" cy="112" rx="72" ry="66" fill="#fde047" stroke="#ca8a04" strokeWidth="4" />
      {/* Flotador */}
      <ellipse cx="100" cy="128" rx="88" ry="30" fill="none" stroke="#f97316" strokeWidth="16" />
      <ellipse cx="100" cy="128" rx="88" ry="30" fill="none" stroke="#fff7ed" strokeWidth="4" strokeDasharray="10 10" />
      {/* Cara */}
      <circle cx="78" cy="98" r="9" fill="#1e293b" />
      <circle cx="122" cy="98" r="9" fill="#1e293b" />
      <circle cx="80" cy="95" r="3" fill="#fff" />
      <circle cx="124" cy="95" r="3" fill="#fff" />
      <path d="M78 120 Q100 142 122 120" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function MascotaInflable({
  escala,
  visible,
  explotando,
}: {
  escala: number;
  visible: boolean;
  explotando: boolean;
}) {
  const [fallo, setFallo] = useState(false);

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {/* Destello y partículas al explotar */}
      {explotando && (
        <>
          <div aria-hidden="true" className="destello pointer-events-none absolute inset-0 rounded-full bg-white" />
          {Array.from({ length: 16 }, (_, i) => {
            const angulo = (Math.PI * 2 * i) / 16;
            const distancia = 130 + (i % 3) * 25;
            return (
              <span
                key={i}
                aria-hidden="true"
                className="particula absolute h-3 w-3 rounded-full"
                style={{
                  backgroundColor: COLORES_CONFETI[i % COLORES_CONFETI.length],
                  ["--x" as string]: `${Math.cos(angulo) * distancia}px`,
                  ["--y" as string]: `${Math.sin(angulo) * distancia}px`,
                }}
              />
            );
          })}
          <p aria-live="assertive" className="texto-pop absolute -top-6 inset-x-0 mx-auto w-max text-4xl font-extrabold text-rose-500 drop-shadow">
            ¡POP!
          </p>
        </>
      )}

      {/* La mascota se infla con transform: scale(...) según el progreso */}
      <div
        className="inflable h-full w-full transition-transform duration-1000 ease-out"
        style={{ transform: `scale(${visible ? escala : 0.001})`, opacity: visible ? 1 : 0 }}
      >
        {fallo ? (
          <FiguraOriginal />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={MASCOTA_SRC}
            alt="Mascota inflable que crece durante la pausa"
            className="h-full w-full object-contain"
            onError={() => setFallo(true)}
          />
        )}
      </div>
    </div>
  );
}
