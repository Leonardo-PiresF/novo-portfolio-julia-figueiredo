import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** Falso quando as variáveis de ambiente não estão definidas. O site cai no conteúdo estático. */
export const supabaseAtivo = Boolean(url && anonKey);

export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder",
  {
    auth: {
      persistSession: typeof window !== "undefined",
      autoRefreshToken: typeof window !== "undefined",
    },
  },
);

export const BUCKET = "portfolio";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Categoria = {
  id: string;
  nome: string;
  ordem: number;
};

export type ItemPortfolio = {
  id: string;
  tipo: "video" | "foto";
  titulo: string;
  subtitulo: string;
  categoria_id: string | null;
  vimeo_id: string | null;
  video_url: string | null;
  poster_url: string | null;
  full_url: string | null;
  destaque: boolean;
  ordem: number;
  publicado: boolean;
  criado_em?: string;
};

export type ConfigPortfolio = {
  id: number;
  videos_por_pagina: number;
  fotos_por_pagina: number;
};

export type DadosPortfolio = {
  itens: ItemPortfolio[];
  categorias: Categoria[];
  config: { videosPorPagina: number; fotosPorPagina: number };
};

// ─── Leitura ──────────────────────────────────────────────────────────────────

/** Usado pelo site. `incluirRascunhos` só funciona com sessão ativa. */
export async function buscarPortfolio(incluirRascunhos = false): Promise<DadosPortfolio> {
  const consultaItens = supabase
    .from("portfolio_itens")
    .select("*")
    .order("ordem", { ascending: true });

  const [itens, categorias, config] = await Promise.all([
    incluirRascunhos ? consultaItens : consultaItens.eq("publicado", true),
    supabase.from("portfolio_categorias").select("*").order("ordem", { ascending: true }),
    supabase.from("portfolio_config").select("*").eq("id", 1).maybeSingle(),
  ]);

  if (itens.error) throw itens.error;
  if (categorias.error) throw categorias.error;

  return {
    itens: (itens.data ?? []) as ItemPortfolio[],
    categorias: (categorias.data ?? []) as Categoria[],
    config: {
      videosPorPagina: (config.data as ConfigPortfolio | null)?.videos_por_pagina ?? 6,
      fotosPorPagina: (config.data as ConfigPortfolio | null)?.fotos_por_pagina ?? 12,
    },
  };
}

// ─── Escrita ──────────────────────────────────────────────────────────────────

export async function salvarItem(
  dados: Partial<ItemPortfolio>,
  id?: string,
): Promise<ItemPortfolio> {
  const consulta = id
    ? supabase.from("portfolio_itens").update(dados).eq("id", id)
    : supabase.from("portfolio_itens").insert(dados);

  const { data, error } = await consulta.select().single();
  if (error) throw error;
  return data as ItemPortfolio;
}

export async function excluirItem(id: string) {
  const { error } = await supabase.from("portfolio_itens").delete().eq("id", id);
  if (error) throw error;
}

export async function trocarOrdem(
  a: { id: string; ordem: number },
  b: { id: string; ordem: number },
) {
  const [r1, r2] = await Promise.all([
    supabase.from("portfolio_itens").update({ ordem: b.ordem }).eq("id", a.id),
    supabase.from("portfolio_itens").update({ ordem: a.ordem }).eq("id", b.id),
  ]);
  if (r1.error) throw r1.error;
  if (r2.error) throw r2.error;
}

export async function salvarCategoria(nome: string, ordem: number, id?: string): Promise<Categoria> {
  const consulta = id
    ? supabase.from("portfolio_categorias").update({ nome }).eq("id", id)
    : supabase.from("portfolio_categorias").insert({ nome, ordem });

  const { data, error } = await consulta.select().single();
  if (error) throw error;
  return data as Categoria;
}

export async function excluirCategoria(id: string) {
  const { error } = await supabase.from("portfolio_categorias").delete().eq("id", id);
  if (error) throw error;
}

export async function trocarOrdemCategoria(
  a: { id: string; ordem: number },
  b: { id: string; ordem: number },
) {
  const [r1, r2] = await Promise.all([
    supabase.from("portfolio_categorias").update({ ordem: b.ordem }).eq("id", a.id),
    supabase.from("portfolio_categorias").update({ ordem: a.ordem }).eq("id", b.id),
  ]);
  if (r1.error) throw r1.error;
  if (r2.error) throw r2.error;
}

export async function salvarConfig(videosPorPagina: number, fotosPorPagina: number) {
  const { error } = await supabase
    .from("portfolio_config")
    .update({ videos_por_pagina: videosPorPagina, fotos_por_pagina: fotosPorPagina })
    .eq("id", 1);
  if (error) throw error;
}

// ─── Arquivos ─────────────────────────────────────────────────────────────────

export async function enviarArquivo(arquivo: File, pasta: string): Promise<string> {
  const extensao = (arquivo.name.split(".").pop() || "jpg").toLowerCase();
  const caminho = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}

/** Remove do storage apenas o que foi enviado pelo painel. Caminhos de /public são ignorados. */
export async function removerArquivo(url?: string | null) {
  if (!url || !url.includes(`/${BUCKET}/`)) return;
  const caminho = url.split(`/${BUCKET}/`)[1];
  if (caminho) await supabase.storage.from(BUCKET).remove([decodeURIComponent(caminho)]);
}

// ─── Extras ───────────────────────────────────────────────────────────────────

/** Aceita link completo ou o número do Vimeo e devolve só o id. */
export function extrairVimeoId(entrada: string): string | null {
  const limpo = entrada.trim();
  if (!limpo) return null;
  if (/^\d+$/.test(limpo)) return limpo;
  const m = limpo.match(/vimeo\.com\/(?:video\/|manage\/videos\/)?(\d+)/);
  return m ? m[1] : null;
}

// ─── Depoimentos ──────────────────────────────────────────────────────────────

export type Depoimento = {
  id: string;
  texto: string;
  nome: string;
  cargo: string;
  avatar_url: string | null;
  ordem: number;
  publicado: boolean;
  criado_em?: string;
};

export async function buscarDepoimentos(incluirRascunhos = false): Promise<Depoimento[]> {
  const consulta = supabase
    .from("portfolio_depoimentos")
    .select("*")
    .order("ordem", { ascending: true });

  const { data, error } = incluirRascunhos ? await consulta : await consulta.eq("publicado", true);
  if (error) throw error;
  return (data ?? []) as Depoimento[];
}

export async function salvarDepoimento(
  dados: Partial<Depoimento>,
  id?: string,
): Promise<Depoimento> {
  const consulta = id
    ? supabase.from("portfolio_depoimentos").update(dados).eq("id", id)
    : supabase.from("portfolio_depoimentos").insert(dados);

  const { data, error } = await consulta.select().single();
  if (error) throw error;
  return data as Depoimento;
}

export async function excluirDepoimento(id: string) {
  const { error } = await supabase.from("portfolio_depoimentos").delete().eq("id", id);
  if (error) throw error;
}

export async function trocarOrdemDepoimento(
  a: { id: string; ordem: number },
  b: { id: string; ordem: number },
) {
  const [r1, r2] = await Promise.all([
    supabase.from("portfolio_depoimentos").update({ ordem: b.ordem }).eq("id", a.id),
    supabase.from("portfolio_depoimentos").update({ ordem: a.ordem }).eq("id", b.id),
  ]);
  if (r1.error) throw r1.error;
  if (r2.error) throw r2.error;
}
