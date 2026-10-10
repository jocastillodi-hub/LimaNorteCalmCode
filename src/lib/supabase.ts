import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente público (anon key). La seguridad recae en las políticas RLS de supabase/usuarios_anonimos.sql.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && clave ? createClient(url, clave) : null;

export const TABLA_ALIAS = "usuarios_anonimos";

// Lee el alias asociado a un identificador anónimo. Devuelve null si no existe.
// Usa una función RPC: el cliente no puede listar la tabla, solo consultar un id que ya conoce.
export async function obtenerAlias(id: string): Promise<string | null> {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { data, error } = await supabase.rpc("obtener_alias", { p_id: id });
  if (error) throw error;
  return typeof data === "string" ? data : null;
}

// Guarda un alias nuevo. El id se genera en el navegador para no necesitar una lectura tras insertar.
export async function crearAlias(id: string, alias: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado");
  const { error } = await supabase.from(TABLA_ALIAS).insert({ id, alias });
  if (error) throw error;
}
