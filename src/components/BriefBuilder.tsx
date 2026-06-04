import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, MessageCircle, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { WHATSAPP } from "@/lib/media";

type Brief = {
  niche: string;
  goal: string;
  volume: string;
  photos: string;
  adsRights: string;
  timeline: string;
};

const goals = ["Vendas", "Brand Awareness", "Paid Ads", "Lançamento de Produto", "Crescimento Social"];
const volumes = ["1–2 vídeos", "3–5 vídeos", "6–10 vídeos", "Recorrente (mensal)"];
const photoOptions = ["Sim, preciso", "Não, só vídeo", "Talvez, me oriente"];
const adsOptions = ["Sim, 3 meses", "Sim, 6 meses", "Não preciso"];
const timelines = ["Urgente (até 7 dias)", "2 semanas", "1 mês", "Sem pressa"];

const steps = [
  { key: "niche", title: "Qual é o seu nicho?", help: "Beleza, tecnologia, gastronomia, serviços..." },
  { key: "goal", title: "Qual o objetivo principal?", help: "O que essa campanha precisa conquistar?" },
  { key: "volume", title: "Volume de conteúdo", help: "Quantos vídeos você imagina por entrega?" },
  { key: "photos", title: "Precisa de fotos?", help: "Posso complementar os vídeos com still photography." },
  { key: "adsRights", title: "Direitos para Paid Ads", help: "Vai impulsionar o conteúdo no tráfego pago?" },
  { key: "timeline", title: "Qual é o prazo?", help: "Quando esse conteúdo precisa estar no ar?" },
] as const;

export function BriefBuilder() {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>({
    niche: "",
    goal: "",
    volume: "",
    photos: "",
    adsRights: "",
    timeline: "",
  });
  const [done, setDone] = useState(false);

  const total = steps.length;
  const current = steps[step];
  const value = brief[current?.key as keyof Brief] ?? "";

  const update = (v: string) =>
    setBrief((b) => ({ ...b, [current.key]: v }));

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  };

  const back = () => step > 0 && setStep(step - 1);

  const recommendation = (() => {
    const v = brief.volume;
    let pkg = "Pacote Estratégico";
    let deliverables = "3 vídeos UGC + 5 fotos editoriais";
    if (v.startsWith("1")) {
      pkg = "Pacote Essencial";
      deliverables = "1–2 vídeos UGC + 2 fotos";
    } else if (v.startsWith("6") || v.startsWith("Recorrente")) {
      pkg = "Pacote Premium";
      deliverables = "6–10 vídeos UGC + 10 fotos + roteiro estratégico";
    }
    return {
      pkg,
      deliverables,
      rights: brief.adsRights || "Direitos para orgânico",
      timeline: brief.timeline || "A definir",
    };
  })();

  const buildMessage = () => {
    const lines = [
      "Olá, Júlia! Vim pelo Content Brief Builder do site.",
      "",
      `• Nicho: ${brief.niche || "—"}`,
      `• Objetivo: ${brief.goal || "—"}`,
      `• Volume: ${brief.volume || "—"}`,
      `• Fotos: ${brief.photos || "—"}`,
      `• Direitos Ads: ${brief.adsRights || "—"}`,
      `• Prazo: ${brief.timeline || "—"}`,
      "",
      `Recomendação sugerida: ${recommendation.pkg}.`,
      "Gostaria de receber uma proposta personalizada.",
    ];
    return encodeURIComponent(lines.join("\n"));
  };

  return (
    <section id="brief" className="relative py-28 lg:py-40 bg-navy text-cream overflow-hidden">
      <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-pink/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-pink-deep/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1100px] px-6 lg:px-14">
        <Reveal className="text-center mb-12">
          <div className="text-[0.72rem] uppercase tracking-[0.22em] text-pink mb-4">Investimento sob medida</div>
          <h2 className="serif text-4xl lg:text-6xl text-cream leading-[1.05]">
            Content Brief <em className="italic text-pink">Builder</em>
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-cream/70 leading-relaxed">
            Em menos de um minuto, monte o briefing ideal e receba uma recomendação personalizada para a sua marca.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-pink/20 bg-cream/[0.03] backdrop-blur-xl p-8 lg:p-14">
            {!done ? (
              <>
                <div className="flex items-center justify-between mb-10">
                  <div className="text-[0.7rem] uppercase tracking-[0.2em] text-pink">
                    Etapa {step + 1} de {total}
                  </div>
                  <div className="flex gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-[3px] w-8 rounded-full transition-all duration-500 ${
                          i <= step ? "bg-pink" : "bg-cream/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="serif text-3xl lg:text-5xl text-cream mb-3 leading-tight">{current.title}</h3>
                    <p className="text-cream/60 mb-10">{current.help}</p>

                    {current.key === "niche" ? (
                      <input
                        autoFocus
                        type="text"
                        value={value}
                        onChange={(e) => update(e.target.value)}
                        placeholder="Ex: Marca de skincare independente"
                        className="w-full bg-transparent border-b-2 border-pink/30 focus:border-pink outline-none py-4 text-2xl serif text-cream placeholder:text-cream/30 transition"
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(current.key === "goal"
                          ? goals
                          : current.key === "volume"
                          ? volumes
                          : current.key === "photos"
                          ? photoOptions
                          : current.key === "adsRights"
                          ? adsOptions
                          : timelines
                        ).map((opt) => {
                          const selected = value === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => update(opt)}
                              className={`group relative flex items-center justify-between gap-4 rounded-2xl border px-6 py-5 text-left transition-all duration-300 ${
                                selected
                                  ? "border-pink bg-pink/10 text-cream"
                                  : "border-cream/15 text-cream/75 hover:border-pink/40 hover:text-cream"
                              }`}
                            >
                              <span className="serif text-lg">{opt}</span>
                              <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                                  selected ? "border-pink bg-pink text-navy" : "border-cream/30"
                                }`}
                              >
                                {selected && <Check size={12} strokeWidth={3} />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={step === 0}
                    className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-cream/60 hover:text-pink disabled:opacity-30 disabled:hover:text-cream/60 transition"
                  >
                    <ArrowLeft size={14} /> Voltar
                  </button>
                  <button
                    onClick={next}
                    disabled={!value}
                    className="group flex items-center gap-3 rounded-full bg-pink px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-navy transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {step === total - 1 ? "Gerar Recomendação" : "Próximo"}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-2 text-pink text-[0.7rem] uppercase tracking-[0.22em] mb-4">
                  <Sparkles size={14} /> Sua recomendação personalizada
                </div>
                <h3 className="serif text-4xl lg:text-6xl text-cream mb-3">
                  {recommendation.pkg}
                </h3>
                <p className="text-cream/70 mb-10 max-w-xl">
                  Com base no seu briefing, este é o caminho que mais faz sentido para a sua marca neste momento.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {[
                    { label: "Entregáveis", value: recommendation.deliverables },
                    { label: "Direitos de uso", value: recommendation.rights },
                    { label: "Prazo", value: recommendation.timeline },
                    { label: "Nicho", value: brief.niche || "Personalizado" },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="rounded-2xl border border-pink/20 bg-cream/[0.04] p-6"
                    >
                      <div className="text-[0.65rem] uppercase tracking-[0.2em] text-pink mb-2">{r.label}</div>
                      <div className="serif text-xl text-cream">{r.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${buildMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-1 items-center justify-center gap-3 rounded-full bg-pink px-8 py-5 text-[0.72rem] uppercase tracking-[0.2em] text-navy transition hover:bg-cream"
                  >
                    <MessageCircle size={16} />
                    Solicitar Proposta Personalizada
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <button
                    onClick={() => {
                      setDone(false);
                      setStep(0);
                    }}
                    className="rounded-full border border-cream/20 px-8 py-5 text-[0.72rem] uppercase tracking-[0.2em] text-cream/70 hover:text-cream hover:border-cream/40 transition"
                  >
                    Refazer briefing
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
