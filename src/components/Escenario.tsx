"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import BotonSOS from "@/components/BotonSOS";
import { EstrellaDeMar } from "@/components/Decoraciones";
import Burbujas from "@/components/Burbujas";
import Caracol from "@/components/Caracol";
import FondoFluido from "@/components/FondoFluido";
import FondoNoche from "@/components/FondoNoche";
import OndaClic from "@/components/OndaClic";
import Vida from "@/components/Vida";
import { setDireccion } from "@/lib/direccion";
import { enlaces } from "@/lib/navegacion";
import { useSesion } from "@/lib/session";

// Elementos donde el gesto horizontal pertenece al control (texto, deslizadores, etc.).
const CONTROLES = "input, textarea, select, [role='slider']";

export default function Escenario({ children }: { children: ReactNode }) {
  const { nocturno } = useSesion();
  const pathname = usePathname();
  const router = useRouter();

  // Deslizar a izquierda/derecha pasa a la sección siguiente/anterior.
  useEffect(() => {
    let inicio: { x: number; y: number; ignorar: boolean } | null = null;

    function alIniciar(e: TouchEvent) {
      const t = e.touches[0];
      const ignorar = !!(e.target as Element | null)?.closest(CONTROLES);
      inicio = { x: t.clientX, y: t.clientY, ignorar };
    }

    function alTerminar(e: TouchEvent) {
      if (!inicio || inicio.ignorar) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - inicio.x;
      const dy = t.clientY - inicio.y;
      inicio = null;
      if (Math.abs(dx) < 70 || Math.abs(dy) > 50) return;

      const actual = enlaces.findIndex((l) => l.href === pathname);
      if (actual === -1) return;
      const siguiente = dx < 0 ? actual + 1 : actual - 1;
      if (siguiente < 0 || siguiente >= enlaces.length) return;
      setDireccion(dx < 0 ? 1 : -1);
      router.push(enlaces[siguiente].href);
    }

    window.addEventListener("touchstart", alIniciar, { passive: true });
    window.addEventListener("touchend", alTerminar, { passive: true });
    return () => {
      window.removeEventListener("touchstart", alIniciar);
      window.removeEventListener("touchend", alTerminar);
    };
  }, [pathname, router]);

  return (
    <div className={nocturno ? "noche" : ""}>
      {/* Día: fluidos, algas y medusas. De noche se desmonta el canvas para ahorrar recursos. */}
      <div aria-hidden="true" className={`fixed inset-0 -z-10 transition-opacity duration-[1500ms] ${nocturno ? "opacity-0" : "opacity-100"}`}>
        {!nocturno && <FondoFluido />}
        {!nocturno && <Vida />}
      </div>
      <FondoNoche activo={nocturno} />
      <Burbujas />
      <OndaClic />
      <Caracol />
      {/* La estrella asoma de vez en cuando por el borde izquierdo. */}
      <div aria-hidden="true" className="asomar fixed left-0 top-1/3 z-0 w-16">
        <EstrellaDeMar className="h-16 w-16" />
      </div>
      <div className="relative z-0">{children}</div>
      <BotonSOS />
    </div>
  );
}
