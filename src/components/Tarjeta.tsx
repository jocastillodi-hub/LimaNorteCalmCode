import type { ReactNode } from "react";

export default function Tarjeta({ titulo, children }: { titulo?: string; children: ReactNode }) {
  return (
    <section className="panel rounded-2xl border border-teal-100 bg-white/85 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      {titulo && <h2 className="mb-3 text-lg font-semibold text-teal-800">{titulo}</h2>}
      {children}
    </section>
  );
}
