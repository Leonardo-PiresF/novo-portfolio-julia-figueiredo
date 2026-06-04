import { Reveal } from "./Reveal";
import { PROFILE } from "@/lib/media";

const skills = ["Vídeo UGC", "Beleza", "Wellness", "Tecnologia", "Serviços", "Gastronomia"];

export function About() {
  return (
    <section id="sobre" className="py-28 lg:py-40">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Bloco de fotos — replicando o layout do site original */}
          <Reveal className="relative min-h-[500px]">
            {/* Foto principal com arco no topo */}
            <div
              className="overflow-hidden"
              style={{
                width: "75%",
                aspectRatio: "2/3",
                borderRadius: "200px 200px 4px 4px",
                background: "linear-gradient(160deg, #fff0f3, #ffc0cb, #041e42)",
              }}
            >
              <img
                src={PROFILE.about1}
                alt="Julia Figueiredo trabalhando"
                loading="eager"
                className="w-full h-full object-cover block"
              />
            </div>

            {/* Foto mini sobreposta no canto inferior direito */}
            <div
              className="absolute right-0 overflow-hidden shadow-2xl"
              style={{
                bottom: "-40px",
                width: "55%",
                aspectRatio: "1",
                borderRadius: "4px 100px 4px 100px",
                border: "2px solid var(--cream, #f5f0eb)",
                background: "linear-gradient(135deg, #ffc0cb, #b5798a, #041e42)",
              }}
            >
              <img
                src={PROFILE.about2}
                alt="Julia Figueiredo em produção"
                loading="eager"
                className="w-full h-full object-cover block"
              />
            </div>
          </Reveal>

          {/* Texto */}
          <div className="pt-10 lg:pt-0">
            <Reveal>
              <div className="eyebrow mb-4">Quem é Júlia</div>
              <h2 className="section-title mb-8">
                Sobre <em>Mim</em>
              </h2>
            </Reveal>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <Reveal delay={0.05}>
                <p>
                  Olá marca! Me chamo <strong className="text-foreground font-medium">Júlia Figueiredo</strong>, e sou UGC Creator, formada em
                  Publicidade e Propaganda, com anos de experiência criando conteúdo estratégico para redes sociais.
                  Mas, mais do que criar vídeos estéticos, eu produzo conteúdos que performam, que prendem a atenção
                  nos primeiros segundos e que transformam visualizações em desejo e desejo em conversão.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  Em um cenário onde todo mundo está repetindo as mesmas trends e copiando os mesmos formatos, eu
                  entrego um conteúdo anti-saturado, pensado estrategicamente para{" "}
                  <strong className="text-foreground font-medium">destacar a sua marca no meio da concorrência.</strong>
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  Eu estudo o seu público, entendo a sua proposta de valor e traduzo isso em vídeos autênticos e
                  impossíveis de ignorar. Se a sua marca busca mais do que conteúdo, busca posicionamento, conexão e
                  resultado, nós vamos trabalhar muito bem juntas.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-2.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-pink-deep/30 bg-pink-soft px-4 py-1.5 text-xs tracking-wide text-pink-deep"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}