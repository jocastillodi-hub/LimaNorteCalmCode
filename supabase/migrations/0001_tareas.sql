-- Organizador de tareas. Ejecutar una vez en el SQL Editor de Supabase.
-- Cada usuario solo puede leer y modificar sus propias tareas (seguridad por filas).

create table if not exists public.tareas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null check (char_length(titulo) between 1 and 120),
  area text not null default 'otra' check (area in ('practicas', 'tesis', 'otra')),
  fecha_limite date,
  hecha boolean not null default false,
  creada_en timestamptz not null default now(),
  hecha_en timestamptz
);

create index if not exists tareas_usuario_estado_idx on public.tareas (usuario_id, hecha, fecha_limite);

alter table public.tareas enable row level security;

create policy "tareas: leer las propias" on public.tareas
  for select using (auth.uid() = usuario_id);

create policy "tareas: crear las propias" on public.tareas
  for insert with check (auth.uid() = usuario_id);

create policy "tareas: actualizar las propias" on public.tareas
  for update using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);

create policy "tareas: borrar las propias" on public.tareas
  for delete using (auth.uid() = usuario_id);

-- Sin acceso para usuarios anónimos.
revoke all on public.tareas from anon;
