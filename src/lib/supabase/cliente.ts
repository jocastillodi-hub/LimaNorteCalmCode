import { createBrowserClient } from "@supabase/ssr";

// Cliente del navegador. Usa solo la clave "publishable": la seguridad real la aplica
// la base de datos con las políticas de seguridad por filas (ver supabase/migrations).
export function crearClienteSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !clave) {
    throw new Error("Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  return createBrowserClient(url, clave);
}
