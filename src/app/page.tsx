import CheckInFlow from "@/components/CheckInFlow";
import { CasaPina, EstrellaDeMar, Medusa } from "@/components/Decoraciones";

// La entrada es Mi Clima Interno: primero cómo te sientes. El alias se pide en WelcomeScreen.
export default function Inicio() {
  return (
    <div className="relative flex flex-col gap-8">
      <CasaPina className="absolute -right-4 -top-16 hidden h-56 md:block" />
      <EstrellaDeMar className="absolute -left-4 bottom-4 hidden h-16 md:block" />
      <Medusa className="idle absolute -right-8 bottom-0 hidden h-40 lg:block" />
      <CheckInFlow />
    </div>
  );
}
