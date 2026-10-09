import type { ReactNode } from "react";

// Tarjeta estilo Duolingo: fondo blanco, esquinas muy redondeadas y borde inferior grueso.
export default function Tarjeta({ titulo, children, className = "" }: { titulo?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`panel rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5 sm:p-6 ${className}`}>
      {titulo && <h2 className="mb-3 text-lg font-bold text-slate-800">{titulo}</h2>}
      {children}
    </section>
  );
}
