-- ============================================================
--  DEPOIMENTOS · rode este arquivo no SQL Editor do Supabase.
--  Complementa o schema.sql que já foi aplicado.
-- ============================================================

create table if not exists portfolio_depoimentos (
  id         uuid primary key default gen_random_uuid(),
  texto      text not null,
  nome       text not null,
  cargo      text not null default '',
  avatar_url text,
  ordem      int  not null default 0,
  publicado  boolean not null default true,
  criado_em  timestamptz not null default now()
);

create index if not exists portfolio_depoimentos_ordem_idx
  on portfolio_depoimentos (ordem);

-- ─── Permissões de tabela (camada anterior ao RLS) ───

grant select on portfolio_depoimentos to anon, authenticated;
grant insert, update, delete on portfolio_depoimentos to authenticated;

-- ─── RLS ───

alter table portfolio_depoimentos enable row level security;

drop policy if exists dep_leitura_publica on portfolio_depoimentos;
create policy dep_leitura_publica on portfolio_depoimentos
  for select to anon using (publicado = true);

drop policy if exists dep_leitura_admin on portfolio_depoimentos;
create policy dep_leitura_admin on portfolio_depoimentos
  for select to authenticated using (true);

drop policy if exists dep_escrita on portfolio_depoimentos;
create policy dep_escrita on portfolio_depoimentos
  for all to authenticated using (true) with check (true);

-- ─── Seed com os depoimentos que estão em Testimonials.tsx ───
-- Os avatares continuam apontando para /public. Rode só uma vez.

insert into portfolio_depoimentos (texto, nome, cargo, avatar_url, ordem)
values
  ('conteúdo de qualidade e bem alinhado à proposta da campanha.',
   'Labpop/Labotrat', '', '/fotos/labotrat-logo.png', 1),
  ('Amamos o trabalho da Maria!',
   'Aneethun', '', '/fotos/aneethun.jpeg', 2),
  ('Júlia, que absurdooo! Tu entrega demais. Tô impactada. Toda a equipe adorou seu conteúdo, simplesmente perfeito. ✨',
   'PERFUMOÁ', '', '/fotos/perfumoa.jpg', 3),
  ('MARAVILHOSAAAA, maria julia foi super rapida entendeu o roteiro maravilhosamente bem, alem de ser linda e super didática, amamos demais!!!',
   'Amiùr', '', '/fotos/amiur.png', 4);

notify pgrst, 'reload schema';
