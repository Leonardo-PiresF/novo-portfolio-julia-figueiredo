import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { useDepoimentos } from "@/hooks/useDepoimentos";

export function Testimonials() {
  const { data, isLoading } = useDepoimentos();
  const depoimentos = data ?? [];
  const total = depoimentos.length;

  const [i, setI] = useState(0);
  const [avatarQuebrou, setAvatarQuebrou] = useState(false);

  // Se um depoimento for removido pelo painel, o índice pode ficar fora da lista.
  useEffect(() => {
    if (i >= total) setI(0);
  }, [i, total]);

  useEffect(() => {
    setAvatarQuebrou(false);
  }, [i]);

  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % total), 7000);
    return () => clearInterval(t);
  }, [total]);

  if (isLoading || total === 0) return null;

  const atual = depoimentos[Math.min(i, total - 1)];
  const inicial = atual.nome.trim().charAt(0).toUpperCase();

  const anterior = () => setI((p) => (p - 1 + total) % total);
  const proximo = () => setI((p) => (p + 1) % total);

  return (
    <section
      id="depoimentos"
      className="py-28 lg:py-40 bg-navy text-cream relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 serif text-[28rem] text-pink/5 select-none pointer-events-none">
        "
      </div>
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-14">
        <Reveal className="text-center mb-16">
          <div className="text-[0.72rem] uppercase tracking-[0.22em] text-pink mb-4">
            Depoimentos
          </div>
          <h2 className="serif text-4xl lg:text-6xl text-cream">
            O que as <em className="italic text-pink">marcas</em> dizem
          </h2>
        </Reveal>

        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={atual.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <Quote className="mx-auto mb-8 text-pink" size={32} />
              <p className="serif text-2xl lg:text-4xl leading-[1.35] text-cream/95 italic mb-10">
                "{atual.texto}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-pink/40 bg-pink/20 flex items-center justify-center serif text-xl text-cream">
                  {atual.avatar_url && !avatarQuebrou ? (
                    <img
                      src={atual.avatar_url}
                      alt={atual.nome}
                      loading="eager"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={() => setAvatarQuebrou(true)}
                    />
                  ) : (
                    <span>{inicial}</span>
                  )}
                </div>
                <div className="text-left">
                  <div className="serif text-lg text-cream">{atual.nome}</div>
                  {atual.cargo && (
                    <div className="text-[0.65rem] uppercase tracking-[0.2em] text-pink">
                      {atual.cargo}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <div className="mt-12 flex items-center justify-center gap-6">
            <button
              onClick={anterior}
              aria-label="Anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/70 hover:border-pink hover:text-pink transition"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {depoimentos.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => setI(idx)}
                  aria-label={`Depoimento ${idx + 1}`}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    i === idx ? "w-10 bg-pink" : "w-5 bg-cream/20"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={proximo}
              aria-label="Próximo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/70 hover:border-pink hover:text-pink transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}