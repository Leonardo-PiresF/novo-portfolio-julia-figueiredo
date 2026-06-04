import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Image as ImageIcon, Video as VideoIcon, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";
import { VIDEOS, PHOTOS, type VideoItem, type PhotoItem } from "@/lib/media";

type Tab = "v" | "f";
type Filter = "all" | "feed" | "portfolio" | "ads";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "feed", label: "Feed / Instagram" },
  { key: "portfolio", label: "Portfólio" },
  { key: "ads", label: "Paid Ads" },
];

// ─── VimeoThumb ────────────────────────────────────────────────────────────────
// Se `poster` estiver preenchido no item, usa ele diretamente.
// Caso contrário, busca a thumbnail automática do Vimeo via oEmbed.
function VimeoThumb({ vimeoId, poster, alt, className }: { vimeoId: string; poster?: string; alt: string; className?: string }) {
  const [oembedThumb, setOembedThumb] = useState<string | null>(null);

  useEffect(() => {
    // Só faz o fetch se não houver poster manual
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
// Captura o primeiro frame do vídeo local via canvas e usa como imagem de capa.
function VideoThumb({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const capture = () => { video.currentTime = 0.001; };

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
        // Falha silenciosa — placeholder escuro permanece
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
  }, [src]);

  if (frameSrc) {
    return (
      <img
        ref={videoRef as unknown as React.RefObject<HTMLImageElement>}
        src={frameSrc}
        alt={alt}
        className={className}
        draggable={false}
      />
    );
  }

  return (
    <div
      className={className}
      style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1a2a3a 100%)" }}
    />
  );
}

// ─── Portfolio ─────────────────────────────────────────────────────────────────
export function Portfolio() {
  const [tab, setTab] = useState<Tab>("v");
  const [filter, setFilter] = useState<Filter>("all");
  const [lightbox, setLightbox] = useState<{
    type: "video" | "photo";
    item: VideoItem | PhotoItem;
  } | null>(null);

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

  const videos =
    filter === "all" ? VIDEOS : VIDEOS.filter((v) => v.category === filter);

  return (
    <section id="portfolio" className="py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-14">
        <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <div>
            <div className="eyebrow mb-4">Portfólio</div>
            <h2 className="section-title">
              Trabalhos <em>selecionados</em>
            </h2>
          </div>
          <div className="flex gap-2 rounded-full border border-border bg-card p-1.5 self-start lg:self-end">
            <button
              onClick={() => setTab("v")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] transition ${
                tab === "v"
                  ? "bg-navy text-cream dark:bg-pink dark:text-navy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <VideoIcon size={13} /> Vídeos
            </button>
            <button
              onClick={() => setTab("f")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.18em] transition ${
                tab === "f"
                  ? "bg-navy text-cream dark:bg-pink dark:text-navy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ImageIcon size={13} /> Fotos
            </button>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {tab === "v" ? (
            <motion.div
              key="v"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Filtros */}
              <div className="flex flex-wrap gap-2 mb-10">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`rounded-full px-4 py-2 text-[0.7rem] uppercase tracking-[0.16em] transition border ${
                      filter === f.key
                        ? "border-pink-deep bg-pink-deep/10 text-pink-deep"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Grid de vídeos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v, i) => (
                  <motion.div
                    key={(v.vimeoId ?? v.src) + i}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.7,
                      delay: (i % 3) * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group relative aspect-[9/14] cursor-pointer overflow-hidden rounded-sm bg-navy"
                    onClick={() => setLightbox({ type: "video", item: v })}
                  >
                    {/* Badge "Featured" no primeiro card */}
                    {i === 0 && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-pink/95 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-navy">
                        <Sparkles size={10} /> Featured
                      </div>
                    )}

                    {/* Thumbnail: Vimeo oEmbed ou primeiro frame do vídeo local */}
                    {v.vimeoId ? (
                      <VimeoThumb
                        vimeoId={v.vimeoId}
                        poster={v.poster || undefined}
                        alt={v.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                      />
                    ) : (
                      <VideoThumb
                        src={v.src}
                        alt={v.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Botão play ao hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink/95 text-navy shadow-2xl">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>

                    {/* Título e marca */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
                      <div className="serif text-xl">{v.title}</div>
                      <div className="text-[0.65rem] uppercase tracking-[0.18em] text-pink mt-1">
                        {v.brand}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="f"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {PHOTOS.map((p, i) => (
                <motion.div
                  key={p.src + i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: (i % 4) * 0.06 }}
                  onClick={() => setLightbox({ type: "photo", item: p })}
                  className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-sm bg-pink-soft"
                >
                  <SmartImage
                    src={p.src}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="serif text-cream text-lg leading-tight">{p.title}</div>
                    <div className="text-[0.6rem] uppercase tracking-[0.18em] text-pink mt-1">{p.sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
              {lightbox.type === "video" ? (
                (lightbox.item as VideoItem).vimeoId ? (
                  // Vimeo: iframe responsivo mantendo aspect 9/16
                  <div
                    className="rounded-sm overflow-hidden"
                    style={{ width: "min(90vw, 50vh)", aspectRatio: "9/16" }}
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${(lightbox.item as VideoItem).vimeoId}?badge=0&autopause=0&autoplay=1&player_id=0&app_id=58479`}
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      title={(lightbox.item as VideoItem).title}
                    />
                  </div>
                ) : (
                  <video
                    src={(lightbox.item as VideoItem).src}
                    controls
                    autoPlay
                    className="max-h-[90vh] max-w-[90vw] rounded-sm"
                  />
                )
              ) : (
                <SmartImage
                  src={(lightbox.item as PhotoItem).full || (lightbox.item as PhotoItem).src}
                  alt={(lightbox.item as PhotoItem).title}
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