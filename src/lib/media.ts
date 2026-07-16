

export const PROFILE = {
  hero: "/fotos/julia-perfil.JPG",
  about1: "/fotos/julia-sobre.webp",
  about2: "/fotos/julia-sobremini2.webp",
  product: "/fotos/julia-produto.webp",
  bethgirl: "/fotos/IMG_1407.webp",
};

export type VideoItem = {
  src: string;
  poster: string;
  title: string;
  brand: string;
  category: "Beleza" | "Esportes" | "Tecnologia"| "Gastronomia";
  vimeoId?: string; 
};

export const VIDEOS: VideoItem[] = [
  { src: "", poster: "/thumbs/thumb-nivea.png", vimeoId: "1198257063", title: "Principia", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-labotrat.png", vimeoId: "1198562468", title: "LabPop | Labotrat", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-beth.png", vimeoId: "1198887213", title: "Beth Girl", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-nivea2.png", vimeoId: "1198890728", title: "Nivea", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-wepink.png", vimeoId: "1198891605", title: "We Pink", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-hollyland.png", vimeoId: "1198892776", title: "Hollyland", brand: "", category: "Tecnologia" },
  { src: "", poster: "/thumbs/thumb-glow.png", vimeoId: "1203671814", title: "Glow Concept", brand: "", category: "Beleza" },
  { src: "/videos/video1.mp4", poster: "/fotos/portfolio(1).jpg",  title: "Beth Girl",           brand: "", category: "Beleza" },
  { src: "/videos/video6.mp4", poster: "/fotos/portfolio(5).JPG",  title: "Beth Girl",           brand: "", category: "Beleza" },
  { src: "/videos/video9.mp4", poster: "/fotos/portfolio(10).JPG", title: "Suerte",              brand: "",        category: "Esportes" },
  { src: "", poster: "/thumbs/thumb-anee.png", vimeoId: "1203535016", title: "ANEETHUN", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-graoesabor.png", vimeoId: "1198257104", title: "Grão e Sabor", brand: "", category: "Gastronomia" },
  { src: "", poster: "/thumbs/thumb-shortperfumoa.png", vimeoId: "1207556756", title: "Perfumoá", brand: "", category: "Beleza" },
  { src: "", poster: "/thumbs/thumb-amiur.png", vimeoId: "1210609924", title: "Amiùr", brand: "", category: "Beleza" },

];

export type PhotoItem = { src: string; full: string; title: string; sub: string };

export const PHOTOS: PhotoItem[] = [
  { src: "/fotos/portfolio(11).webp",  full: "/fotos/portfolio(11).webp",  title: "Beth Girl", sub: "" },
  { src: "/fotos/portfolio(16).webp",   full: "/fotos/portfolio(16).webp",   title: "Pantene", sub: "" },
  { src: "/fotos/portfolio(5).webp",  full: "/fotos/portfolio(5).webp",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(6).webp",  full: "/fotos/portfolio(6).webp",  title: "Hollyland", sub: "" },
  { src: "/fotos/portfolio(7).webp",  full: "/fotos/portfolio(7).webp",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(8).webp",  full: "/fotos/portfolio(8).webp",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio.webp",     full: "/fotos/portfolio.webp",     title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(9).webp",  full: "/fotos/portfolio(9).webp",  title: "Suerte",   sub: "" },
  { src: "/fotos/portfolio(10).webp", full: "/fotos/portfolio(10).webp", title: "Suerte",   sub: "" },
  { src: "/fotos/glow.webp",          full: "/fotos/glow.webp",          title: "Glow",     sub: "" },
  { src: "/fotos/labotrat.webp",      full: "/fotos/labotrat.webp",      title: "Labotrat", sub: "" },
  { src: "/fotos/labotrat2.webp",     full: "/fotos/labotrat2.webp",     title: "Labotrat", sub: "" },
  { src: "/fotos/ju-labotrat.webp",   full: "/fotos/ju-labotrat.webp",   title: "Labotrat", sub: "" },
  { src: "/fotos/portfolio(12).webp",   full: "/fotos/portfolio(12).webp",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(13).webp",   full: "/fotos/portfolio(13).webp",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(14).webp",   full: "/fotos/portfolio(14).webp",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(15).webp",   full: "/fotos/portfolio(15).webp",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(17).webp",   full: "/fotos/portfolio(17).webp",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(18).webp",   full: "/fotos/portfolio(18).webp",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(19).webp",   full: "/fotos/portfolio(19).webp",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(20).webp",   full: "/fotos/portfolio(20).webp",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(21).webp",   full: "/fotos/portfolio(21).webp",   title: "Amiùr", sub: "" },
  { src: "/fotos/portfolio(22).webp",   full: "/fotos/portfolio(22).webp",   title: "Amiùr", sub: "" },
  { src: "/fotos/portfolio(23).webp",   full: "/fotos/portfolio(23).webp",   title: "Amiùr", sub: "" },
  { src: "/fotos/portfolio(24).webp",   full: "/fotos/portfolio(24).webp",   title: "Amiùr", sub: "" },

];

export const CLIENTS = {

  c3: "/fotos/labotrat-logo.png",
  c4: "/fotos/aneethun.jpeg",
  c5: "/fotos/perfumoa.jpg",
  c6: "/fotos/amiur.png",

};

export const WHATSAPP = "5582996241281";