import { redirect } from "next/navigation";

// Mi Clima Interno es la pantalla de inicio. Esta ruta solo redirige enlaces antiguos.
export default function CheckInRedirect() {
  redirect("/");
}
