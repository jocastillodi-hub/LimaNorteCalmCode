-- Tabla de identidades anónimas (solo alias). Ejecutar una vez en el SQL Editor de Supabase.
-- No guarda correo, nombre real ni datos del check-in: el id es un UUID generado en el navegador.

create table if not exists public.usuarios_anonimos (
  id uuid primary key,
  alias text not null check (char_length(alias) between 2 and 24),
  creado_en timestamptz not null default now()
);

alter table public.usuarios_anonimos enable row level security;

-- Cualquiera (anon) puede registrar su alias, pero no puede leer la tabla completa.
drop policy if exists "crear alias anonimo" on public.usuarios_anonimos;
create policy "crear alias anonimo"
  on public.usuarios_anonimos
  for insert
  to anon
  with check (true);

-- Lectura puntual: solo devuelve el alias de un id concreto que el cliente ya conoce.
create or replace function public.obtener_alias(p_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select alias from public.usuarios_anonimos where id = p_id;
$$;

revoke all on function public.obtener_alias(uuid) from public;
grant execute on function public.obtener_alias(uuid) to anon;
