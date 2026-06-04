import { Reveal } from "./Reveal";
import { FileText, MessageCircle, Video, Send } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Briefing",
    text: "Conversamos sobre marca, público, objetivos e referências para alinhar a estratégia.",
  },
  {
    n: "02",
    icon: FileText,
    title: "Roteiro",
    text: "Crio um roteiro estratégico, validado com você antes da gravação.",
  },
  {
    n: "03",
    icon: Video,
    title: "Produção",
    text: "Gravação e edição com atenção a cada detalhe. Entrego na qualidade e formato que você precisa.",
  },
  {
    n: "04",
    icon: Send,
    title: "Entrega",
    text: "Até 2 revisões incluídas. Arquivos prontos para publicação com todos os direitos de uso cedidos.",
  },
];

export function Process() {
  return (
    <section id="processo" className="py-28 lg:py-40">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-14">
        <Reveal className="text-center max-w-2xl mx-auto mb-20">
          <div className="eyebrow mb-4">Como Funciona</div>
          <h2 className="section-title">
            Do briefing à <em>entrega</em>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Um processo claro e colaborativo para garantir que o conteúdo final reflita a essência da sua marca.
          </p>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="absolute top-12 left-0 right-0 hidden lg:block h-px bg-gradient-to-r from-transparent via-pink-deep/30 to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-2 hover:border-pink-deep/40 hover:shadow-xl hover:shadow-pink-deep/5">
                <div className="absolute top-6 right-6 serif text-5xl text-pink-deep/20">{s.n}</div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-navy text-cream dark:bg-pink dark:text-navy">
                  <s.icon size={18} />
                </div>
                <h3 className="serif text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
