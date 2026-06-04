import { Reveal } from "./Reveal";
import { Sparkles, Target, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Sparkles, label: "Autenticidade", text: "Conteúdo que parece recomendação, não publicidade." },
  { icon: Target, label: "Estratégia", text: "Roteiro, público e performance estudados antes de gravar." },
  { icon: TrendingUp, label: "Conversão", text: "Foco em quebra de objeções e decisão de compra." },
];

export function WhatIsUGC() {
  return (
    <section id="ugc" className="relative bg-pink-soft py-28 lg:py-40 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-pink/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1300px] px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          <div className="lg:col-span-5">
            <Reveal>
              <div className="eyebrow mb-4">O que é UGC</div>
              <h2 className="section-title mb-10">
                E por que a sua marca <em>precisa</em> dele?
              </h2>
            </Reveal>

            {/* Foto com arco no topo + logo sobreposta */}
            <Reveal delay={0.1}>
              <div className="relative w-full">
                {/* Foto principal com arco */}
                <div
                  className="overflow-hidden w-full"
                  style={{
                    aspectRatio: "3/4",
                    borderRadius: "200px 200px 4px 4px",
                    background: "linear-gradient(160deg, #fff0f3, #ffc0cb, #041e42)",
                  }}
                >
                  <img
                    src="/fotos/ju-labotrat.JPG"
                    alt="Julia Figueiredo com produto Labotrat"
                    loading="eager"
                    className="w-full h-full object-cover block"
                  />
                </div>

                {/* Logo Labotrat — círculo com a cor roxa da marca, sem fundo branco */}
                <div
                  className="absolute flex items-center justify-center overflow-hidden shadow-lg"
                  style={{
                    top: "20px",
                    right: "-20px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#b06ab3",
                  }}
                >
                  <img
                    src="/fotos/labotrat-logo.png"
                    alt="Labotrat"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 space-y-6 text-muted-foreground leading-relaxed">
            <Reveal>
              <p>
                UGC significa <strong className="text-foreground font-medium">User Generated Content</strong>, ou conteúdo gerado por criador.
                Mas, hoje, ele vai muito além de alguém gravando um vídeo com o seu produto. O UGC estratégico é
                conteúdo pensado para gerar identificação, confiança e vendas. É estruturado com roteiro, estudo de
                público, análise de consumo e foco em performance.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                Muitas marcas pagam caro por alcance quando, na verdade, o que precisam é de conteúdo que quebre
                objeções, gere desejo e conduza o cliente até a decisão de compra. Se você está cansado de conteúdos
                rasos, vídeos bonitos que não vendem ou campanhas que geram visualizações, mas não resultado, talvez o
                problema não seja o seu produto. Talvez seja a estratégia por trás da comunicação.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                O UGC resolve isso porque une autenticidade com direcionamento estratégico. Ele fala a língua do
                consumidor, se adapta ao formato das redes sociais e é pensado para performar tanto no{" "}
                <strong className="text-foreground font-medium">orgânico quanto no tráfego pago.</strong> Em um mercado saturado de
                tendências repetidas, o UGC estratégico não parece publicidade. Ele parece recomendação. E recomendação
                gera confiança. Confiança gera <strong className="text-foreground font-medium">decisão.</strong>
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="grid sm:grid-cols-3 gap-4 pt-8">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="group rounded-2xl border border-pink-deep/15 bg-background/70 backdrop-blur p-6 transition hover:border-pink-deep/40 hover:-translate-y-1 duration-500"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-deep/10 text-pink-deep">
                      <h.icon size={16} />
                    </div>
                    <div className="serif text-lg text-foreground mb-1">{h.label}</div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{h.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <a
                href="#contato"
                className="inline-flex items-center gap-2 mt-6 serif italic text-lg text-pink-deep border-b border-pink-deep/40 pb-1 hover:border-pink-deep transition"
              >
                Quero conteúdos à altura da minha marca →
              </a>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}