"use client";

import type { ReactNode } from "react";
import { useSesion } from "@/lib/session";

// Oculta la interfaz bajo la pantalla de bienvenida y la hace entrar escalonada al desbloquear.
// Los elementos marcados con `data-reveal` son los que se animan (ver globals.css).
export default function EntradaApp({ children }: { children: ReactNode }) {
  const { fase } = useSesion();
  const clase = fase === "bloqueada" ? "app-oculta" : fase === "entrando" ? "app-entrando" : "";

  return <div className={clase}>{children}</div>;
}
