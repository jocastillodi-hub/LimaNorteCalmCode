-- ============================================================
-- Organizador semanal (lunes a domingo). Script completo e idempotente:
-- se puede ejecutar más de una vez sin borrar datos.
-- ============================================================

-- 1. Perfil del usuario (correo y fecha de consentimiento).
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  correo text not null,
  nombre text check (char_length(nombre) <= 40),
  consentimiento_at timestamptz not null,
  creado_en timestamptz not null default now()
);

-- 2. Tareas por semana y día.
--    semana: fecha del lunes de esa semana (AAAA-MM-DD)
--    dia: 1 = lunes ... 7 = domingo
create table if not exists public.tareas_semana (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  semana date not null,
  dia smallint not null check (dia between 1 and 7),
  titulo text not null check (char_length(titulo) between 1 and 120),
  area text not null default 'otra' check (area in ('practicas', 'tesis', 'otra')),
  hecha boolean not null default false,
  creada_en timestamptz not null default now(),
  hecha_en timestamptz
);

create index if not exists tareas_semana_usuario_semana_idx on public.tareas_semana (usuario_id, semana, dia);

-- 3. Seguridad por filas: cada usuario solo ve y modifica lo suyo.
alter table public.perfiles enable row level security;
alter table public.tareas_semana enable row level security;

drop policy if exists "perfil: leer el propio" on public.perfiles;
create policy "perfil: leer el propio" on public.perfiles
  for select using (auth.uid() = id);

drop policy if exists "perfil: crear el propio" on public.perfiles;
create policy "perfil: crear el propio" on public.perfiles
  for insert with check (auth.uid() = id);

drop policy if exists "perfil: actualizar el propio" on public.perfiles;
create policy "perfil: actualizar el propio" on public.perfiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "tareas: leer las propias" on public.tareas_semana;
create policy "tareas: leer las propias" on public.tareas_semana
  for select using (auth.uid() = usuario_id);

drop policy if exists "tareas: crear las propias" on public.tareas_semana;
create policy "tareas: crear las propias" on public.tareas_semana
  for insert with check (auth.uid() = usuario_id);

drop policy if exists "tareas: actualizar las propias" on public.tareas_semana;
create policy "tareas: actualizar las propias" on public.tareas_semana
  for update using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);

drop policy if exists "tareas: borrar las propias" on public.tareas_semana;
create policy "tareas: borrar las propias" on public.tareas_semana
  for delete using (auth.uid() = usuario_id);

-- 4. Sin acceso para usuarios no registrados.
revoke all on public.perfiles from anon;
revoke all on public.tareas_semana from anon;

-- 5. Verificación: debe devolver dos filas con el nombre de cada tabla.
select to_regclass('public.perfiles') as perfiles, to_regclass('public.tareas_semana') as tareas_semana;
