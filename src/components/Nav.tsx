import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ugc", label: "O que é UGC" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#processo", label: "Processo" },
  { href: "#depoimentos", label: "Depoimentos" },
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 backdrop-blur-xl bg-background/90 border-b border-pink/20"
            : "py-5 backdrop-blur-md bg-background/60 border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-14">
          <a href="#top" className="serif text-[1.35rem] tracking-tight">
            Júlia <span className="text-pink-deep italic">F.</span>
          </a>
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative text-[0.72rem] uppercase tracking-[0.18em] transition-colors hover:text-pink-deep ${
                    active === l.href ? "text-pink-deep" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-pink-deep"
                    />
                  )}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contato"
                className="rounded-full border border-pink-deep/60 px-5 py-2 text-[0.7rem] uppercase tracking-[0.18em] text-pink-deep transition hover:bg-pink-deep hover:text-background"
              >
                Trabalhe Comigo
              </a>
            </li>
            <li>
              <button
                onClick={toggle}
                aria-label="Trocar tema"
                className="rounded-full border border-border p-2 text-muted-foreground hover:text-pink-deep hover:border-pink-deep/50 transition"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggle}
              aria-label="Trocar tema"
              className="rounded-full border border-border p-2 text-muted-foreground"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="rounded-full border border-border p-2 text-foreground"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="serif text-xl">
                Júlia <span className="text-pink-deep italic">F.</span>
              </span>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="p-2">
                <X size={20} />
              </button>
            </div>
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="flex flex-col items-center justify-center gap-6 pt-20"
            >
              {[...links, { href: "#contato", label: "Trabalhe Comigo" }].map((l) => (
                <motion.li
                  key={l.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    onClick={() => setOpen(false)}
                    href={l.href}
                    className="serif text-3xl text-foreground hover:text-pink-deep transition"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
