import CheckInFlow from "@/components/CheckInFlow";

// La entrada ya es el check-in: primero cómo te sientes, sin pedir nombre.
export default function Inicio() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-center text-sm text-slate-600">
        Esta herramienta apoya, no diagnostica · sin registro, sin nombre
      </p>
      <CheckInFlow />
    </div>
  );
}
