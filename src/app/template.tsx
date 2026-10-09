"use client";

import { getDireccion } from "@/lib/direccion";

// template se vuelve a montar en cada navegación: cada pantalla entra deslizándose
// desde el lado del último gesto.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrada" style={{ ["--dir" as string]: getDireccion() }}>{children}</div>;
}
