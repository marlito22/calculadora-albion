-- Ejecutar una vez en Supabase > SQL Editor
create table public.specs (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  recurso text not null,
  tier int not null check (tier between 4 and 8),
  nivel int not null check (nivel between 0 and 100),
  fama_restante bigint not null default 0,
  actualizado timestamptz not null default now(),
  primary key (user_id, recurso, tier)
);

alter table public.specs enable row level security;

create policy "specs propias" on public.specs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
