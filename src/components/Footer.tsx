import { Instagram, Music2 } from "lucide-react";

const nav = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ugc", label: "O que é UGC" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#processo", label: "Processo" },
  { href: "#brief", label: "Briefing" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-cream pt-20 pb-10 border-t border-pink/10">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-cream/10">
          <div className="lg:col-span-5">
            <div className="serif text-3xl">
              Júlia <em className="italic text-pink">Figueiredo</em>
            </div>
            <p className="mt-5 max-w-md text-cream/60 leading-relaxed text-sm">
              UGC Creator e estrategista de conteúdo. Crio vídeos autênticos e impossíveis de ignorar, pensados para
              destacar a sua marca e converter.
            </p>
          </div>

          <div className="lg:col-span-4">
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-pink mb-5">Navegação</div>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-cream/70 hover:text-pink transition">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[0.65rem] uppercase tracking-[0.22em] text-pink mb-5">Social</div>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/juliafigueiredoo/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-pink hover:text-pink transition"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@mjuliaugc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream/70 hover:border-pink hover:text-pink transition"
              >
                <Music2 size={16} />
              </a>
            </div>
            <div className="mt-6 text-xs text-cream/50">juliafigueiredougc@gmail.com</div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <div>© {new Date().getFullYear()} Júlia Figueiredo. Todos os direitos reservados.</div>
          <div className="serif italic">Crafted with intention.</div>
        </div>
      </div>
    </footer>
  );
}
