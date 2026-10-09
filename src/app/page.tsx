import CheckInFlow from "@/components/CheckInFlow";
import { CasaPina, EstrellaDeMar, Medusa } from "@/components/Decoraciones";

// La entrada ya es el check-in: primero cómo te sientes, sin pedir nombre.
export default function Inicio() {
  return (
    <div className="relative flex flex-col gap-8">
      <CasaPina className="absolute -right-4 -top-16 hidden h-56 md:block" />
      <EstrellaDeMar className="absolute -left-8 bottom-10 hidden h-28 md:block" />
      <Medusa className="idle absolute -right-8 bottom-0 hidden h-40 lg:block" />
      <p className="relative text-center text-sm font-medium text-sky-950">
        🐚 Esta herramienta apoya, no diagnostica · sin registro, sin nombre
      </p>
      <CheckInFlow />
    </div>
  );
}
