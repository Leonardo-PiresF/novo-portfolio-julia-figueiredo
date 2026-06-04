import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { WhatIsUGC } from "@/components/WhatIsUGC";
import { Portfolio } from "@/components/Portfolio";
import { ContentTypes } from "@/components/ContentTypes";
import { BriefBuilder } from "@/components/BriefBuilder";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Júlia Figueiredo | UGC Creator & Estrategista de Conteúdo" },
      {
        name: "description",
        content:
          "Conteúdo UGC estratégico, autêntico e de alta conversão para marcas que querem se destacar. Portfólio, processo e briefing personalizado.",
      },
      { property: "og:title", content: "Júlia Figueiredo | UGC Creator" },
      {
        property: "og:description",
        content: "Vídeos UGC e fotografia editorial que transformam atenção em desejo e desejo em conversão.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ThemeProvider>
      <Nav />
      <main>
        <Hero />
        <About />
        <WhatIsUGC />
        <Portfolio />
        <ContentTypes />
        <BriefBuilder />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
