import { Medusa } from "@/components/Decoraciones";

// Vida del fondo de día: algas que se mecen y medusas translúcidas que flotan.
// Están en la capa más baja (z-index negativo) y no interactúan con el contenido.
function Alga({ className, color }: { className: string; color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 180" className={`alga pointer-events-none absolute bottom-0 ${className}`}>
      <path d="M30 180 C10 130 50 100 30 60 C18 30 40 10 30 0" stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M30 150 C44 120 16 110 26 80" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export default function Vida() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <Alga className="left-[4%] h-40 w-10" color="#2dd4bf" />
      <Alga className="left-[12%] h-28 w-8" color="#22c55e" />
      <Alga className="right-[6%] h-44 w-12" color="#0d9488" />
      <Alga className="right-[18%] h-24 w-8" color="#4ade80" />
      <Medusa className="medusa-flota absolute left-[20%] top-[20%] h-24 opacity-50" />
      <Medusa className="medusa-flota absolute right-[24%] top-[45%] h-16 opacity-40 [animation-delay:-4s]" />
      <Medusa className="medusa-flota absolute left-[60%] top-[12%] h-20 opacity-35 [animation-delay:-7s]" />
    </div>
  );
}
