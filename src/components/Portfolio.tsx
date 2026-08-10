import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";
import { usePortfolio } from "@/hooks/usePortfolio";
import type { ItemPortfolio } from "@/lib/supabase";

type Tab = "v" | "f";

// ─── VimeoThumb ────────────────────────────────────────────────────────────────
// Se `poster` estiver preenchido no item, usa ele diretamente.
// Caso contrário, busca a thumbnail automática do Vimeo via oEmbed.
function VimeoThumb({
  vimeoId,
  poster,
  alt,
  className,
}: {
  vimeoId: string;
  poster?: string;
  alt: string;
  className?: string;
}) {
  const [oembedThumb, setOembedThumb] = useState<string | null>(null);

  useEffect(() => {
    if (poster) return;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=540`)
      .then((r) => r.json())
      .then((d) => d.thumbnail_url && setOembedThumb(d.thumbnail_url))
      .catch(() => {});
  }, [vimeoId, poster]);

  const src = poster || oembedThumb;

  if (src) {
    return <img src={src} alt={alt} className={className} draggable={false} />;
  }

  return (
    <div
      className={className}
      style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1a2a3a 100%)" }}
    />
  );
}

// ─── VideoThumb ────────────────────────────────────────────────────────────────
// Usa a capa cadastrada quando ela existe. Se o arquivo não carregar (ou não
// houver capa), captura o primeiro frame do vídeo local via canvas.
function VideoThumb({
  src,
  poster,
  alt,
  className,
}: {
  src: string;
  poster?: string | null;
  alt: string;
  className?: string;
}) {
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [posterOk, setPosterOk] = useState(Boolean(poster));

  useEffect(() => {
    setPosterOk(Boolean(poster));
  }, [poster]);

  useEffect(() => {
    if (!src || posterOk) return;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const capture = () => {
      video.currentTime = 0.001;
    };

    const drawFrame = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 540;
        canvas.height = video.videoHeight || 960;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setFrameSrc(canvas.toDataURL("image/jpeg", 0.85));
      } catch {
        // Falha silenciosa, o placeholder escuro permanece
      }
    };

    video.addEventListener("loadedmetadata", capture);
    video.addEventListener("seeked", drawFrame);
    video.src = src;

    return () => {
      video.removeEventListener("loadedmetadata", capture);
      video.removeEventListener("seeked", drawFrame);
      video.src = "";
    };
  }, [src, posterOk]);

  if (poster && posterOk) {
    return (
      <img
        src={poster}
        alt={alt}
        className={className}
        draggable={false}
        onError={() => setPosterOk(false)}
      />
    );
  }

  if (frameSrc) {
    return <img src={frameSrc} alt={alt} className={className} draggable={false} />;
  }

  return (
    <div
      className={className}
      style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1a2a3a 100%)" }}
    />
  );
}

// ─── Paginação ─────────────────────────────────────────────────────────────────
function Paginacao({
  pagina,
  totalPaginas,
  onIr,
}: {
  pagina: number;
  totalPaginas: number;
  onIr: (p: number) => void;
}) {
  if (totalPaginas <= 1) return null;

  const paginas: (number | "gap")[] = [];
  if (totalPaginas <= 7) {
    for (let p = 1; p <= totalPaginas; p++) paginas.push(p);
  } else {
    paginas.push(1);
    if (pagina > 3) paginas.push("gap");
    for (let p = Math.max(2, pagina - 1); p <= Math.min(totalPaginas - 1, pagina + 1); p++) {
      paginas.push(p);
    }
    if (pagina < totalPaginas - 2) paginas.push("gap");
    paginas.push(totalPaginas);
  }

  const base =
    "flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-[0.72rem] uppercase tracking-[0.16em] transition";
  const neutro =
    "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30";

  return (
    <nav
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginação do portfólio"
    >
      <button
        onClick={() => onIr(pagina - 1)}
        disabled={pagina === 1}
        aria-label="Página anterior"
        className={`${base} ${neutro} disabled:opacity-30`}
      >
        <ChevronLeft size={15} />
      </button>

      {paginas.map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onIr(p)}
            aria-current={p === pagina ? "page" : undefined}
            className={`${base} ${
              p === pagina
                ? "border-navy bg-navy text-cream dark:border-pink dark:bg-pink dark:text-navy"
                : neutro
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onIr(pagina + 1)}
        disabled={pagina === totalPaginas}
        aria-label="Próxima página"
        className={`${base} ${neutro} disabled:opacity-30`}
      >
        <ChevronRight size={15} />
      </button>
    </nav>
  );
}

// ─── Portfolio ─────────────────────────────────────────────────────────────────
export function Portfolio() {
  const { data, isLoading } = usePortfolio();

  const [tab, setTab] = useState<Tab>("v");
  const [filtro, setFiltro] = useState<string>("all");
  const [pagina, setPagina] = useState<{ v: number; f: number }>({ v: 1, f: 1 });
  const [lightbox, setLightbox] = useState<ItemPortfolio | null>(null);
  const secaoRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const itens = useMemo(() => data?.itens ?? [], [data]);
  const categorias = useMemo(() => data?.categorias ?? [], [data]);
  const porPagina =
    tab === "v" ? (data?.config.videosPorPagina ?? 6) : (data?.config.fotosPorPagina ?? 12);

  // Só mostra categorias que têm algum item na aba aberta.
  const categoriasDaAba = useMemo(() => {
    const doTipo = itens.filter((i) => i.tipo === (tab === "v" ? "video" : "foto"));
    return categorias.filter((c) => doTipo.some((i) => i.categoria_id === c.id));
  }, [itens, categorias, tab]);

  const lista = useMemo(() => {
    const tipo = tab === "v" ? "video" : "foto";
    return itens
      .filter((i) => i.tipo === tipo && (filtro === "all" || i.categoria_id === filtro))
      .sort((a, b) => a.ordem - b.ordem);
  }, [itens, tab, filtro]);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const paginaAtual = Math.min(pagina[tab], totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  function trocarTab(nova: Tab) {
    setTab(nova);
    setFiltro("all");
    setPagina((p) => ({ ...p, [nova]: 1 }));
  }

  function trocarFiltro(chave: string) {
    setFiltro(chave);
    setPagina((p) => ({ ...p, [tab]: 1 }));
  }

  function irParaPagina(p: number) {
    setPagina((atual) => ({ ...atual, [tab]: p }));
    secaoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const abaBotao = (ativa: boolean) =>
    `flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] transition ${
      ativa ? "bg-navy text-cream dark:bg-pink dark:text-navy" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <section ref={secaoRef} id="portfolio" className="py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-14">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <div className="eyebrow mb-4">Portfólio</div>
            <h2 className="section-title">
              Trabalhos <em>selecionados</em>
            </h2>
          </div>
          <div className="flex gap-2 rounded-full border border-border bg-card p-1.5 self-start lg:self-end">
            <button onClick={() => trocarTab("v")} className={abaBotao(tab === "v")}>
              <VideoIcon size={13} /> Vídeos
            </button>
            <button onClick={() => trocarTab("f")} className={abaBotao(tab === "f")}>
              <ImageIcon size={13} /> Fotos
            </button>
          </div>
        </Reveal>

        {/* Filtros por categoria */}
        {categoriasDaAba.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {[{ id: "all", nome: "Todos" }, ...categoriasDaAba].map((c) => (
              <button
                key={c.id}
                onClick={() => trocarFiltro(c.id)}
                className={`rounded-full px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] transition border ${
                  filtro === c.id
                    ? "border-pink-deep bg-pink-deep/10 text-pink-deep"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div
            className={
              tab === "v"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            }
          >
            {Array.from({ length: porPagina }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-sm bg-pink-soft ${
                  tab === "v" ? "aspect-[9/14]" : "aspect-[3/4]"
                }`}
              />
            ))}
          </div>
        ) : visiveis.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Nenhum trabalho nessa categoria por enquanto.
          </p>
        ) : (
          <AnimatePresence mode="wait">
            {tab === "v" ? (
              <motion.div
                key={`v-${filtro}-${paginaAtual}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visiveis.map((v, i) => (
                  <motion.div
                    key={v.id}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative aspect-[9/14] cursor-pointer overflow-hidden rounded-sm bg-navy"
                    onClick={() => setLightbox(v)}
                  >
                    {v.destaque && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-pink/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-navy">
                        <Sparkles size={10} /> Featured
                      </div>
                    )}

                    {v.vimeo_id ? (
                      <VimeoThumb
                        vimeoId={v.vimeo_id}
                        poster={v.poster_url || undefined}
                        alt={v.titulo}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                      />
                    ) : (
                      <VideoThumb
                        src={v.video_url ?? ""}
                        poster={v.poster_url}
                        alt={v.titulo}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink/95 text-navy shadow-2xl">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
                      <div className="serif text-xl">{v.titulo}</div>
                      {v.subtitulo && (
                        <div className="text-[0.65rem] uppercase tracking-[0.18em] text-pink mt-1">
                          {v.subtitulo}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`f-${filtro}-${paginaAtual}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {visiveis.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: (i % 4) * 0.06 }}
                    onClick={() => setLightbox(p)}
                    className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-sm bg-pink-soft"
                  >
                    <SmartImage
                      src={p.poster_url ?? ""}
                      alt={p.titulo}
                      className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                      fallbackClassName="h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="serif text-cream text-lg leading-tight">{p.titulo}</div>
                      {p.subtitulo && (
                        <div className="text-[0.6rem] uppercase tracking-[0.18em] text-pink mt-1">
                          {p.subtitulo}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <Paginacao pagina={paginaAtual} totalPaginas={totalPaginas} onIr={irParaPagina} />
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-[90vw]"
            >
              {lightbox.tipo === "video" ? (
                lightbox.vimeo_id ? (
                  <div
                    className="rounded-sm overflow-hidden"
                    style={{ width: "min(90vw, 50vh)", aspectRatio: "9/16" }}
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${lightbox.vimeo_id}?badge=0&autopause=0&autoplay=1&player_id=0&app_id=58479`}
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      title={lightbox.titulo}
                    />
                  </div>
                ) : (
                  <video
                    src={lightbox.video_url ?? ""}
                    controls
                    autoPlay
                    className="max-h-[90vh] max-w-[90vw] rounded-sm"
                  />
                )
              ) : (
                <SmartImage
                  src={lightbox.full_url || lightbox.poster_url || ""}
                  alt={lightbox.titulo}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  fallbackClassName="h-[60vh] w-[60vw]"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
