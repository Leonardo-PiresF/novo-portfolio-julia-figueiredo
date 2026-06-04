import { Mail, MessageCircle, Instagram, Music2, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { WHATSAPP } from "@/lib/media";

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+55 (82) 99624-1281",
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá, Júlia! Vim pelo seu portfólio e gostaria de falar sobre um projeto.")}`,
    featured: true,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "juliafigueiredougc@gmail.com",
    href: "mailto:juliafigueiredougc@gmail.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@juliafigueiredoo",
    href: "https://www.instagram.com/juliafigueiredoo/",
  },
  {
    icon: Music2,
    label: "TikTok",
    value: "@mjuliaugc",
    href: "https://www.tiktok.com/@mjuliaugc",
  },
];

export function Contact() {
  return (
    <section id="contato" className="py-28 lg:py-40 bg-pink-soft">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-14">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow mb-4">Contato</div>
          <h2 className="section-title">
            Vamos criar algo <em>incrível</em> juntas?
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Conte sobre a sua marca, o seu produto e o objetivo da campanha. Respondo todas as mensagens pessoalmente.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl border p-7 lg:p-9 transition-all duration-500 ${
                  c.featured
                    ? "border-pink-deep bg-navy text-cream hover:bg-pink-deep lg:col-span-2"
                    : "border-pink-deep/20 bg-background hover:border-pink-deep/50 hover:-translate-y-1"
                }`}
              >
                <div className="flex items-center gap-5 min-w-0 flex-1">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
                      c.featured ? "bg-pink text-navy" : "bg-pink-deep/10 text-pink-deep"
                    }`}
                  >
                    <c.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-[0.65rem] uppercase tracking-[0.22em] mb-1 ${
                        c.featured ? "text-pink" : "text-pink-deep"
                      }`}
                    >
                      {c.label}
                    </div>
                    <div
                      className={`serif text-xl lg:text-2xl truncate ${
                        c.featured ? "text-cream" : "text-foreground"
                      }`}
                    >
                      {c.value}
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  size={20}
                  className={`shrink-0 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                    c.featured ? "text-pink" : "text-pink-deep/60"
                  }`}
                />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}