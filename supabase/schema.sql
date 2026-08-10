-- ============================================================
--  PORTFÓLIO JÚLIA FIGUEIREDO · schema do Supabase
--  Rode este arquivo inteiro no SQL Editor do Supabase.
--  Pode rodar de novo sem quebrar nada (menos o seed do final).
-- ============================================================

create extension if not exists "pgcrypto";

-- ─────────────── TABELAS ───────────────

create table if not exists portfolio_categorias (
  id        uuid primary key default gen_random_uuid(),
  nome      text not null unique,
  ordem     int  not null default 0,
  criado_em timestamptz not null default now()
);

create table if not exists portfolio_itens (
  id           uuid primary key default gen_random_uuid(),
  tipo         text not null check (tipo in ('video', 'foto')),
  titulo       text not null,
  subtitulo    text not null default '',
  categoria_id uuid references portfolio_categorias(id) on delete set null,

  -- vídeo: preencher vimeo_id OU video_url
  vimeo_id     text,
  video_url    text,

  -- foto: poster_url é a imagem do grid, full_url a versão do lightbox
  -- vídeo: poster_url é a capa mostrada antes do play
  poster_url   text,
  full_url     text,

  destaque     boolean not null default false,
  ordem        int     not null default 0,
  publicado    boolean not null default true,
  criado_em    timestamptz not null default now(),

  constraint video_tem_fonte check (
    tipo <> 'video' or vimeo_id is not null or video_url is not null
  ),
  constraint foto_tem_imagem check (
    tipo <> 'foto' or poster_url is not null
  )
);

create index if not exists portfolio_itens_tipo_ordem_idx
  on portfolio_itens (tipo, ordem, criado_em desc);

create table if not exists portfolio_config (
  id                int primary key default 1 check (id = 1),
  videos_por_pagina int not null default 6,
  fotos_por_pagina  int not null default 12
);

insert into portfolio_config (id) values (1) on conflict (id) do nothing;

-- ─────────────── PERMISSÕES DE TABELA ───────────────
-- Camada anterior ao RLS. Projetos Supabase recentes não concedem isso
-- sozinhos, e sem estes grants o PostgREST responde 42501 permission denied
-- mesmo com as políticas certas.

grant usage on schema public to anon, authenticated;

grant select on portfolio_categorias, portfolio_itens, portfolio_config
  to anon, authenticated;

grant insert, update, delete on portfolio_categorias, portfolio_itens, portfolio_config
  to authenticated;

-- ─────────────── SEGURANÇA (RLS) ───────────────

alter table portfolio_categorias enable row level security;
alter table portfolio_itens      enable row level security;
alter table portfolio_config     enable row level security;

drop policy if exists cat_leitura on portfolio_categorias;
create policy cat_leitura on portfolio_categorias for select using (true);

drop policy if exists cat_escrita on portfolio_categorias;
create policy cat_escrita on portfolio_categorias
  for all to authenticated using (true) with check (true);

-- Visitante vê só o que está publicado. Quem está logado vê tudo.
drop policy if exists itens_leitura_publica on portfolio_itens;
create policy itens_leitura_publica on portfolio_itens
  for select to anon using (publicado = true);

drop policy if exists itens_leitura_admin on portfolio_itens;
create policy itens_leitura_admin on portfolio_itens
  for select to authenticated using (true);

drop policy if exists itens_escrita on portfolio_itens;
create policy itens_escrita on portfolio_itens
  for all to authenticated using (true) with check (true);

drop policy if exists config_leitura on portfolio_config;
create policy config_leitura on portfolio_config for select using (true);

drop policy if exists config_escrita on portfolio_config;
create policy config_escrita on portfolio_config
  for all to authenticated using (true) with check (true);

-- ─────────────── STORAGE ───────────────

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists portfolio_obj_leitura on storage.objects;
create policy portfolio_obj_leitura on storage.objects
  for select using (bucket_id = 'portfolio');

drop policy if exists portfolio_obj_envio on storage.objects;
create policy portfolio_obj_envio on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio');

drop policy if exists portfolio_obj_update on storage.objects;
create policy portfolio_obj_update on storage.objects
  for update to authenticated using (bucket_id = 'portfolio');

drop policy if exists portfolio_obj_delete on storage.objects;
create policy portfolio_obj_delete on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio');

-- ============================================================
--  SEED · conteúdo que hoje está em src/lib/media.ts
--  Os caminhos continuam apontando para /public, então nada
--  precisa ser reenviado. Rode só uma vez.
-- ============================================================

insert into portfolio_categorias (nome, ordem) values
  ('Beleza', 1), ('Esportes', 2), ('Tecnologia', 3), ('Gastronomia', 4)
on conflict (nome) do nothing;

-- Vídeos
insert into portfolio_itens (tipo, titulo, subtitulo, categoria_id, vimeo_id, video_url, poster_url, destaque, ordem)
select 'video', d.titulo, '', (select id from portfolio_categorias c where c.nome = d.cat),
       nullif(d.vimeo, ''), nullif(d.video, ''), d.poster, d.destaque, d.ordem
from (values
  ('Principia',        'Beleza',      '1198257063', '', '/thumbs/thumb-nivea.png',          true,   1),
  ('LabPop | Labotrat','Beleza',      '1198562468', '', '/thumbs/thumb-labotrat.png',       false,  2),
  ('Beth Girl',        'Beleza',      '1198887213', '', '/thumbs/thumb-beth.png',           false,  3),
  ('Nivea',            'Beleza',      '1198890728', '', '/thumbs/thumb-nivea2.png',         false,  4),
  ('We Pink',          'Beleza',      '1198891605', '', '/thumbs/thumb-wepink.png',         false,  5),
  ('Hollyland',        'Tecnologia',  '1198892776', '', '/thumbs/thumb-hollyland.png',      false,  6),
  ('Glow Concept',     'Beleza',      '1203671814', '', '/thumbs/thumb-glow.png',           false,  7),
  -- Sem poster de propósito: o componente captura o primeiro frame do mp4.
  -- Dá para subir uma capa própria pelo painel depois.
  ('Beth Girl',        'Beleza',      '', '/videos/video1.mp4', null,                       false,  8),
  ('Beth Girl',        'Beleza',      '', '/videos/video6.mp4', null,                       false,  9),
  ('Suerte',           'Esportes',    '', '/videos/video9.mp4', null,                       false, 10),
  ('ANEETHUN',         'Beleza',      '1203535016', '', '/thumbs/thumb-anee.png',           false, 11),
  ('Grão e Sabor',     'Gastronomia', '1198257104', '', '/thumbs/thumb-graoesabor.png',     false, 12),
  ('Perfumoá',         'Beleza',      '1207556756', '', '/thumbs/thumb-shortperfumoa.png',  false, 13),
  ('Amiùr',            'Beleza',      '1210609924', '', '/thumbs/thumb-amiur.png',          false, 14)
) as d(titulo, cat, vimeo, video, poster, destaque, ordem);

-- Fotos
insert into portfolio_itens (tipo, titulo, subtitulo, categoria_id, poster_url, full_url, ordem)
select 'foto', d.titulo, '', (select id from portfolio_categorias c where c.nome = d.cat),
       d.url, d.url, d.ordem
from (values
  ('Beth Girl', 'Beleza', '/fotos/portfolio(11).webp',  1),
  ('Pantene',   'Beleza', '/fotos/portfolio(16).webp',  2),
  ('We Pink',   'Beleza', '/fotos/portfolio(5).webp',   3),
  ('Hollyland', 'Tecnologia', '/fotos/portfolio(6).webp', 4),
  ('We Pink',   'Beleza', '/fotos/portfolio(7).webp',   5),
  ('We Pink',   'Beleza', '/fotos/portfolio(8).webp',   6),
  ('We Pink',   'Beleza', '/fotos/portfolio.webp',      7),
  ('Suerte',    'Esportes', '/fotos/portfolio(9).webp', 8),
  ('Suerte',    'Esportes', '/fotos/portfolio(10).webp',9),
  ('Glow',      'Beleza', '/fotos/glow.webp',          10),
  ('Labotrat',  'Beleza', '/fotos/labotrat.webp',      11),
  ('Labotrat',  'Beleza', '/fotos/labotrat2.webp',     12),
  ('Labotrat',  'Beleza', '/fotos/ju-labotrat.webp',   13),
  ('ANEETHUN',  'Beleza', '/fotos/portfolio(12).webp', 14),
  ('ANEETHUN',  'Beleza', '/fotos/portfolio(13).webp', 15),
  ('ANEETHUN',  'Beleza', '/fotos/portfolio(14).webp', 16),
  ('ANEETHUN',  'Beleza', '/fotos/portfolio(15).webp', 17),
  ('Perfumoá',  'Beleza', '/fotos/portfolio(17).webp', 18),
  ('Perfumoá',  'Beleza', '/fotos/portfolio(18).webp', 19),
  ('Perfumoá',  'Beleza', '/fotos/portfolio(19).webp', 20),
  ('Perfumoá',  'Beleza', '/fotos/portfolio(20).webp', 21),
  ('Amiùr',     'Beleza', '/fotos/portfolio(21).webp', 22),
  ('Amiùr',     'Beleza', '/fotos/portfolio(22).webp', 23),
  ('Amiùr',     'Beleza', '/fotos/portfolio(23).webp', 24),
  ('Amiùr',     'Beleza', '/fotos/portfolio(24).webp', 25)
) as d(titulo, cat, url, ordem);

-- Recarrega o cache de schema do PostgREST
notify pgrst, 'reload schema';
