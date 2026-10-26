-- Torneo Relámpago - esquema de base de datos (ejecutar en el SQL Editor de Supabase)

create extension if not exists pgcrypto;

create table teams (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('f1', 'f2', 'f3')),
  name text not null check (length(trim(name)) > 0),
  created_at timestamptz not null default now(),
  unique (category, name)
);

create table visors (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) > 0)
);

-- Aislada de `visors` para que el hash del PIN nunca llegue a clientes públicos ni a Realtime.
create table visor_pins (
  visor_id uuid primary key references visors (id) on delete cascade,
  pin_hash text not null
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('f1', 'f2', 'f3')),
  round text not null check (round in ('round16', 'quarter', 'semi', 'third', 'final')),
  position int not null check (position >= 0),
  home_team_id uuid references teams (id) on delete set null,
  away_team_id uuid references teams (id) on delete set null,
  home_score int not null default 0 check (home_score >= 0),
  away_score int not null default 0 check (away_score >= 0),
  home_yellow int not null default 0 check (home_yellow >= 0),
  away_yellow int not null default 0 check (away_yellow >= 0),
  home_red int not null default 0 check (home_red >= 0),
  away_red int not null default 0 check (away_red >= 0),
  home_pens int not null default 0 check (home_pens >= 0),
  away_pens int not null default 0 check (away_pens >= 0),
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed')),
  winner_id uuid references teams (id) on delete set null,
  court text,
  visor_id uuid references visors (id) on delete set null,
  unique (category, round, position)
);

-- Llaves vacías: 16 equipos (octavos) en f1/f2, 4 equipos (semifinales) en f3.
insert into matches (category, round, position)
select r.category, r.round, p
from (values
  ('f1', 'round16', 8), ('f1', 'quarter', 4), ('f1', 'semi', 2), ('f1', 'third', 1), ('f1', 'final', 1),
  ('f2', 'round16', 8), ('f2', 'quarter', 4), ('f2', 'semi', 2), ('f2', 'third', 1), ('f2', 'final', 1),
  ('f3', 'semi', 2), ('f3', 'third', 1), ('f3', 'final', 1)
) as r (category, round, total)
cross join lateral generate_series(0, r.total - 1) as p;

-- Incremento atómico de contadores del partido en vivo (solo service role).
create function adjust_match_stat(p_match uuid, p_field text, p_delta int)
returns void
language plpgsql
as $$
declare
  updated int;
begin
  if p_field not in (
    'home_score', 'away_score', 'home_yellow', 'away_yellow',
    'home_red', 'away_red', 'home_pens', 'away_pens'
  ) then
    raise exception 'Campo inválido: %', p_field;
  end if;

  execute format(
    'update matches set %1$I = greatest(%1$I + $1, 0) where id = $2 and status = ''in_progress''',
    p_field
  ) using p_delta, p_match;

  get diagnostics updated = row_count;
  if updated = 0 then
    raise exception 'El partido no está en vivo';
  end if;
end;
$$;

revoke all on function adjust_match_stat(uuid, text, int) from public, anon, authenticated;

-- Lectura pública; toda escritura pasa por server actions con service role.
alter table teams enable row level security;
alter table visors enable row level security;
alter table visor_pins enable row level security;
alter table matches enable row level security;

create policy "public read" on teams for select using (true);
create policy "public read" on visors for select using (true);
create policy "public read" on matches for select using (true);

-- Realtime
alter publication supabase_realtime add table teams, visors, matches;
