import { useQuery } from "@tanstack/react-query";
import { buscarDepoimentos, supabaseAtivo, type Depoimento } from "@/lib/supabase";
import { CLIENTS } from "@/lib/media";

/**
 * Mesma ideia do usePortfolio: se as variáveis de ambiente faltarem ou o
 * Supabase falhar, a seção continua com os depoimentos originais.
 */
function depoimentosEstaticos(): Depoimento[] {
  const base = [
    {
      texto: "conteúdo de qualidade e bem alinhado à proposta da campanha.",
      nome: "Labpop/Labotrat",
      avatar_url: CLIENTS.c3,
    },
    {
      texto: "Amamos o trabalho da Maria!",
      nome: "Aneethun",
      avatar_url: CLIENTS.c4,
    },
    {
      texto:
        "Júlia, que absurdooo! Tu entrega demais. Tô impactada. Toda a equipe adorou seu conteúdo, simplesmente perfeito. ✨",
      nome: "PERFUMOÁ",
      avatar_url: CLIENTS.c5,
    },
    {
      texto:
        "MARAVILHOSAAAA, maria julia foi super rapida entendeu o roteiro maravilhosamente bem, alem de ser linda e super didática, amamos demais!!!",
      nome: "Amiùr",
      avatar_url: CLIENTS.c6,
    },
  ];

  return base.map((d, i) => ({
    id: `depoimento-estatico-${i}`,
    texto: d.texto,
    nome: d.nome,
    cargo: "",
    avatar_url: d.avatar_url,
    ordem: i + 1,
    publicado: true,
  }));
}

export function useDepoimentos() {
  return useQuery<Depoimento[]>({
    queryKey: ["depoimentos"],
    queryFn: async () => {
      if (!supabaseAtivo) return depoimentosEstaticos();
      try {
        const lista = await buscarDepoimentos();
        return lista.length ? lista : depoimentosEstaticos();
      } catch {
        return depoimentosEstaticos();
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
