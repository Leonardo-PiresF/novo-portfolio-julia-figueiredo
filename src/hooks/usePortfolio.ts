import { useQuery } from "@tanstack/react-query";
import {
  buscarPortfolio,
  supabaseAtivo,
  type Categoria,
  type DadosPortfolio,
  type ItemPortfolio,
} from "@/lib/supabase";
import { VIDEOS, PHOTOS } from "@/lib/media";

/**
 * Conteúdo de src/lib/media.ts convertido para o formato do banco.
 * Serve como rede de segurança: se as variáveis de ambiente faltarem
 * ou o Supabase estiver fora do ar, a seção continua mostrando o portfólio.
 */
function dadosEstaticos(): DadosPortfolio {
  const nomes = Array.from(new Set(VIDEOS.map((v) => v.category)));
  const categorias: Categoria[] = nomes.map((nome, i) => ({
    id: `estatica-${nome}`,
    nome,
    ordem: i + 1,
  }));

  const videos: ItemPortfolio[] = VIDEOS.map((v, i) => ({
    id: `video-estatico-${i}`,
    tipo: "video",
    titulo: v.title,
    subtitulo: v.brand ?? "",
    categoria_id: `estatica-${v.category}`,
    vimeo_id: v.vimeoId ?? null,
    video_url: v.src || null,
    poster_url: v.poster || null,
    full_url: null,
    destaque: i === 0,
    ordem: i + 1,
    publicado: true,
  }));

  const fotos: ItemPortfolio[] = PHOTOS.map((p, i) => ({
    id: `foto-estatica-${i}`,
    tipo: "foto",
    titulo: p.title,
    subtitulo: p.sub ?? "",
    categoria_id: null,
    vimeo_id: null,
    video_url: null,
    poster_url: p.src,
    full_url: p.full || p.src,
    destaque: false,
    ordem: i + 1,
    publicado: true,
  }));

  return {
    itens: [...videos, ...fotos],
    categorias,
    config: { videosPorPagina: 6, fotosPorPagina: 12 },
  };
}

export function usePortfolio() {
  return useQuery<DadosPortfolio>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      if (!supabaseAtivo) return dadosEstaticos();
      try {
        const dados = await buscarPortfolio();
        return dados.itens.length ? dados : dadosEstaticos();
      } catch {
        return dadosEstaticos();
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
