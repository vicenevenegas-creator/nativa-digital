-- Esquema de Nativa Digital en Supabase
-- Búsqueda: marca de bomba -> modelo -> eje (mm) -> fluido -> sello Graphite

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuarios (se crean solos al registrarse en Supabase Auth, ver punto 6)
CREATE TABLE usuarios (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 email TEXT UNIQUE NOT NULL,
 nombre TEXT NOT NULL,
 rol TEXT NOT NULL DEFAULT 'cliente',
 creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 proveedor TEXT
);

-- 2. Personal de la empresa: correo @graphite.com.ar
create or replace function public.es_personal()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt()->>'email', '') ilike '%@graphite.com.ar'
$$;

-- 3. Sellos Graphite
create table public.sellos (
  codigo        text primary key,
  nombre        text not null,
  foto_producto text,
  foto_plano    text,
  creado_en     timestamptz not null default now()
);

-- 4. Bomba + eje + fluido -> sello Graphite (una fila por combinación, igual que el Excel)
create table public.compatibilidades (
  id           uuid primary key default gen_random_uuid(),
  marca_bomba  text not null,
  modelo_bomba text not null,
  eje_mm       numeric(6,2) not null check (eje_mm > 0),
  fluido       text not null,
  codigo_sello text not null references public.sellos(codigo)
               on update cascade on delete cascade,
  creado_en    timestamptz not null default now(),
  unique (marca_bomba, modelo_bomba, eje_mm, fluido, codigo_sello)
);

-- 5. Consultas / leads: guarda lo que buscó el cliente como texto
create table public.consultas_leads (
  id                uuid primary key default gen_random_uuid(),
  fecha             timestamptz not null default now(),
  marca_bomba       text,
  modelo_bomba      text,
  eje_mm            numeric(6,2),
  fluido            text,
  codigo_sello      text references public.sellos(codigo)
                    on update cascade on delete set null,
  nombre_contacto   text not null,
  telefono_contacto text not null,
  email_contacto    text,
  empresa           text,
  origen            text not null default 'web',
  estado            text not null default 'pendiente'
                    check (estado in ('pendiente', 'en_cotizacion', 'cerrado', 'perdido'))
);

-- Permisos
alter table public.sellos enable row level security;
alter table public.compatibilidades enable row level security;
alter table public.consultas_leads enable row level security;

create policy "Lectura publica sellos" on public.sellos
  for select using (true);
create policy "Personal gestiona sellos" on public.sellos
  for all to authenticated using (public.es_personal()) with check (public.es_personal());

create policy "Lectura publica compatibilidades" on public.compatibilidades
  for select using (true);
create policy "Personal gestiona compatibilidades" on public.compatibilidades
  for all to authenticated using (public.es_personal()) with check (public.es_personal());

create policy "Cualquiera registra una consulta" on public.consultas_leads
  for insert with check (true);
create policy "Personal gestiona consultas" on public.consultas_leads
  for all to authenticated using (public.es_personal()) with check (public.es_personal());

-- Fotos de producto y planos: <codigo>_producto.jpg / <codigo>_plano.jpg
insert into storage.buckets (id, name, public)
values ('sellos', 'sellos', true)
on conflict (id) do nothing;

create policy "Personal sube fotos de sellos" on storage.objects
  for insert to authenticated with check (bucket_id = 'sellos' and public.es_personal());
create policy "Personal edita fotos de sellos" on storage.objects
  for update to authenticated using (bucket_id = 'sellos' and public.es_personal());
create policy "Personal borra fotos de sellos" on storage.objects
  for delete to authenticated using (bucket_id = 'sellos' and public.es_personal());

-- 6. Alta automática en usuarios al crearse una cuenta en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
 INSERT INTO public.usuarios (id, email, nombre, proveedor)
 VALUES (
 NEW.id,
 NEW.email,
 COALESCE(
 NEW.raw_user_meta_data->>'full_name',
 NEW.raw_user_meta_data->>'name',
 'Usuario Nuevo'
 ),
 NEW.raw_app_meta_data->>'provider'
 );
 RETURN NEW;
END;
$function$;

CREATE TRIGGER on_auth_user_created
 AFTER INSERT ON auth.users
 FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
