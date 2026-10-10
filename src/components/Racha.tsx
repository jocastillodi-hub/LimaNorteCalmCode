"use client";

import { useEffect, useRef, useState } from "react";
import { useSesion } from "@/lib/session";

// Racha de la sesión: una hamburguesa dorada que brilla y cuenta las actividades completadas.
export default function Racha() {
  const { racha } = useSesion();
  const [brillo, setBrillo] = useState(false);
  const previa = useRef(racha);

  useEffect(() => {
    if (racha > previa.current) {
      setBrillo(true);
      const id = setTimeout(() => setBrillo(false), 1200);
      previa.current = racha;
      return () => clearTimeout(id);
    }
    previa.current = racha;
  }, [racha]);

  return (
    <div
      className="flex items-center gap-2 whitespace-nowrap rounded-full bg-amber-300/90 px-3 py-1.5 text-sm font-bold text-amber-950 shadow"
      title="Racha de actividades completadas en esta sesión"
    >
      <span aria-hidden="true" className={`text-lg ${brillo ? "racha-brilla" : ""}`}>🍔</span>
      <span aria-live="polite">Racha: {racha}</span>
    </div>
  );
}
