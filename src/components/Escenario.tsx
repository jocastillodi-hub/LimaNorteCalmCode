"use client";

import type { ReactNode } from "react";
import BotonSOS from "@/components/BotonSOS";
import Burbujas from "@/components/Burbujas";
import Caracol from "@/components/Caracol";
import FondoFluido from "@/components/FondoFluido";
import FondoNoche from "@/components/FondoNoche";
import OndaClic from "@/components/OndaClic";
import RecordatorioBurbuja from "@/components/RecordatorioBurbuja";
import Vida from "@/components/Vida";
import { useSesion } from "@/lib/session";

// Decide el fondo de día o de noche. Las capas de fondo tienen z-index negativo;
// el contenido va encima. De noche se desmonta el canvas para ahorrar recursos.
export default function Escenario({ children }: { children: ReactNode }) {
  const { nocturno } = useSesion();

  return (
    <div className={nocturno ? "noche" : ""}>
      <div aria-hidden="true" className={`fixed inset-0 -z-10 transition-opacity duration-[1500ms] ${nocturno ? "opacity-0" : "opacity-100"}`}>
        {!nocturno && <FondoFluido />}
        {!nocturno && <Vida />}
      </div>
      <FondoNoche activo={nocturno} />
      <Burbujas />
      <OndaClic />
      <Caracol />
      <div className="relative z-0">{children}</div>
      <RecordatorioBurbuja />
      <BotonSOS />
    </div>
  );
}
