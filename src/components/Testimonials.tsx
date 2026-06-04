import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { CLIENTS } from "@/lib/media";

const testimonials = [
  {
    text: "Oi, Ju! Tudo bem? Menina, que conteúdo incrível que você produziu. O pessoal da agência adorou!!!",
    name: "Bruna",
    role: "Agência de marketing",
    avatar: CLIENTS.c1,
    initial: "B",
  },
  {
    text: "Passando para te dar um feedback da nossa equipe: amamos os vídeosss. Você bateu a meta de vendas aqui da loja. Parabéns pelo excelente trabalho.",
    name: "Elisabeth",
    role: "Loja varejista",
    avatar: CLIENTS.c2,
    initial: "E",
  },
  {
    text: "Você é diferenciada demais. Superou as expectativas! 😍😍",
    name: "Carlos",
    role: "Marca de serviços",
    avatar: CLIENTS.c3,
    initial: "C",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % testimonials.length);
  const prev = () => setI((p) => (p - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, []);

  const current = testimonials[i];

  return (
    <section id="depoimentos" className="py-28 lg:py-40 bg-navy text-cream relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 serif text-[28rem] text-pink/5 select-none pointer-events-none">
        "
      </div>
      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-14">
        <Reveal className="text-center mb-16">
          <div className="text-[0.72rem] uppercase tracking-[0.22em] text-pink mb-4">Depoimentos</div>
          <h2 className="serif text-4xl lg:text-6xl text-cream">
            O que as <em className="italic text-pink">marcas</em> dizem
          </h2>
        </Reveal>

        <div className="relative min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center max-w-3xl mx-auto"
            >
              <Quote className="mx-auto mb-8 text-pink" size={32} />
              <p className="serif text-2xl lg:text-4xl leading-[1.35] text-cream/95 italic mb-10">
                "{current.text}"
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-pink/40 bg-pink/20 flex items-center justify-center serif text-xl text-cream">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="relative">{current.initial}</span>
                </div>
                <div className="text-left">
                  <div className="serif text-lg text-cream">{current.name}</div>
                  <div className="text-[0.65rem] uppercase tracking-[0.2em] text-pink">{current.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/70 hover:border-pink hover:text-pink transition"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Depoimento ${idx + 1}`}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === idx ? "w-10 bg-pink" : "w-5 bg-cream/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Próximo"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/70 hover:border-pink hover:text-pink transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}