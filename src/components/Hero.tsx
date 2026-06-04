import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { PROFILE } from "@/lib/media";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={PROFILE.hero}
          alt="Julia Figueiredo"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/85 dark:from-black/40 dark:via-black/30 dark:to-black/90" />
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-end pb-24 px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.4em" }}
          animate={{ opacity: 1, letterSpacing: "0.22em" }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-[0.7rem] uppercase text-pink"
        >
          UGC Creator · Estrategista de Conteúdo
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="serif text-white text-[clamp(3.5rem,11vw,9rem)] leading-[0.92] tracking-tight"
        >
          Júlia
          <br />
          <span className="italic font-light text-pink">Figueiredo</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            className="group rounded-full bg-pink px-7 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] text-navy transition hover:bg-white"
          >
            Ver Portfólio
          </a>
          <a
            href="#contato"
            className="rounded-full border border-white/60 px-7 py-3.5 text-[0.72rem] uppercase tracking-[0.2em] text-white transition hover:border-pink hover:text-pink"
          >
            Trabalhe Comigo
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-pink"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}