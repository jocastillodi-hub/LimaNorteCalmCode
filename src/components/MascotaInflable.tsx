"use client";

import { useState } from "react";

// Mascota que se infla con la respiración. Pon tu propia imagen (con licencia) en
// public/mascota-flotador.png. Si no existe, se muestra una burbuja neutra.
export const MASCOTA_SRC = "/mascota-flotador.png";

const COLORES_CONFETI = ["#fde047", "#f472b6", "#67e8f9", "#a78bfa", "#86efac", "#fb923c"];

export default function MascotaInflable({
  escala,
  visible,
  explotando,
  duracionMs = 1000,
}: {
  escala: number;
  visible: boolean;
  explotando: boolean;
  duracionMs?: number;
}) {
  const [fallo, setFallo] = useState(false);

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
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

      <div
        className="inflable h-full w-full ease-in-out"
        style={{
          transform: `scale(${visible ? escala : 0.001})`,
          opacity: visible ? 1 : 0,
          transitionProperty: "transform, opacity",
          transitionDuration: `${duracionMs}ms`,
        }}
      >
        {fallo ? (
          <div aria-hidden="true" className="h-full w-full rounded-full bg-gradient-to-br from-sky-200 to-cyan-400 opacity-90 shadow-inner" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={MASCOTA_SRC}
            alt="Mascota que sigue el ritmo de la respiración"
            className="h-full w-full object-contain"
            onError={() => setFallo(true)}
          />
        )}
      </div>
    </div>
  );
}
