import { redirect } from "next/navigation";

// El check-in ahora es la pantalla de inicio.
export default function CheckInRedirect() {
  redirect("/");
}
