-- Agrega el nombre del proyecto a cada tarea (para la tabla semanal).
-- Idempotente: se puede ejecutar más de una vez.
alter table public.tareas_semana add column if not exists proyecto text not null default 'General'
  check (char_length(proyecto) between 1 and 60);

select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'tareas_semana' and column_name = 'proyecto';
