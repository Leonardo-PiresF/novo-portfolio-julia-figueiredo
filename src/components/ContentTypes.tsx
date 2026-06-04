import { Reveal } from "./Reveal";
import { Package, MessageSquareQuote, Lightbulb, Gift, Heart, Mic, TrendingUp } from "lucide-react";

const types = [
  { icon: Package, title: "Product Demo", text: "Demonstrações claras que mostram o produto em uso real." },
  { icon: MessageSquareQuote, title: "Testimonial Style", text: "Depoimentos autênticos que constroem prova social." },
  { icon: Lightbulb, title: "Problema / Solução", text: "Roteiros que quebram objeções e geram identificação." },
  { icon: Gift, title: "Unboxing", text: "A experiência de abrir o produto, frame a frame." },
  { icon: Heart, title: "Lifestyle", text: "Conteúdo aspiracional integrado à rotina do público." },
  { icon: Mic, title: "Voiceover", text: "Narrativas conduzidas com voz e direção editorial." },
  { icon: TrendingUp, title: "Paid Ads Creative", text: "Criativos otimizados para performar no tráfego pago." },
];

export function ContentTypes() {
  return (
    <section className="py-28 lg:py-40 bg-pink-soft">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-14">
        <Reveal className="max-w-2xl mb-16">
          <div className="eyebrow mb-4">Categorias</div>
          <h2 className="section-title">
            Tipos de conteúdo <em>que produzo</em>
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Cada formato é pensado para um objetivo. Combine os tipos certos e construa uma narrativa completa para a
            sua marca.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {types.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.04}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-pink-deep/15 bg-background/80 p-7 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-pink-deep/40 hover:shadow-xl hover:shadow-pink-deep/5">
                <div className="absolute top-0 right-0 h-32 w-32 bg-pink/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-navy text-cream dark:bg-pink dark:text-navy transition-transform duration-500 group-hover:rotate-6">
                    <t.icon size={18} />
                  </div>
                  <h3 className="serif text-2xl mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
