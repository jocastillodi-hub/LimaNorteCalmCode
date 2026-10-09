"use client";

import type { ReactNode } from "react";
import Burbujas from "@/components/Burbujas";
import Caracol from "@/components/Caracol";
import FondoFluido from "@/components/FondoFluido";
import FondoNoche from "@/components/FondoNoche";
import OndaClic from "@/components/OndaClic";
import { useSesion } from "@/lib/session";

// Decide el fondo (día o noche) y envuelve la página. La noche se superpone con
// una transición de opacidad, así el cambio es gradual.
export default function Escenario({ children }: { children: ReactNode }) {
  const { nocturno } = useSesion();

  return (
    <div className={nocturno ? "noche" : ""}>
      {/* Día: el fondo de fluidos se desmonta de noche para ahorrar recursos. */}
      <div aria-hidden="true" className={`fixed inset-0 -z-10 transition-opacity duration-[1500ms] ${nocturno ? "opacity-0" : "opacity-100"}`}>
        {!nocturno && <FondoFluido />}
      </div>
      <FondoNoche activo={nocturno} />
      <Burbujas />
      <OndaClic />
      <Caracol />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
