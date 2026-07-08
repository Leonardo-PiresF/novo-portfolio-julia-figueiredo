

export const PROFILE = {
  hero: "/fotos/julia-perfil.JPG",
  about1: "/fotos/julia-sobre.jpg",
  about2: "/fotos/julia-sobremini2.jpg",
  product: "/fotos/julia-produto.jpg",
  bethgirl: "/fotos/IMG_1407.jpg",
};

export type VideoItem = {
  src: string;
  poster: string;
  title: string;
  brand: string;
  category: "feed" | "portfolio" | "ads";
  vimeoId?: string; 
};

export const VIDEOS: VideoItem[] = [
  { src: "", poster: "/thumbs/thumb-nivea.png", vimeoId: "1198257063", title: "Principia", brand: "", category: "portfolio" },
  { src: "", poster: "/thumbs/thumb-labotrat.png", vimeoId: "1198562468", title: "LabPop | Labotrat", brand: "", category: "ads" },
  { src: "", poster: "/thumbs/thumb-beth.png", vimeoId: "1198887213", title: "Beth Girl", brand: "", category: "feed" },
  { src: "", poster: "/thumbs/thumb-nivea2.png", vimeoId: "1198890728", title: "Nivea", brand: "", category: "portfolio" },
  { src: "", poster: "/thumbs/thumb-wepink.png", vimeoId: "1198891605", title: "We Pink", brand: "", category: "portfolio" },
  { src: "", poster: "/thumbs/thumb-hollyland.png", vimeoId: "1198892776", title: "Hollyland", brand: "", category: "portfolio" },
  { src: "", poster: "/thumbs/thumb-glow.png", vimeoId: "1203671814", title: "Glow Concept", brand: "", category: "ads" },
  { src: "/videos/video1.mp4", poster: "/fotos/portfolio(1).jpg",  title: "Beth Girl",           brand: "", category: "feed" },
  { src: "/videos/video6.mp4", poster: "/fotos/portfolio(5).JPG",  title: "Beth Girl",           brand: "", category: "feed" },
  { src: "/videos/video9.mp4", poster: "/fotos/portfolio(10).JPG", title: "Suerte",              brand: "",        category: "portfolio" },
  { src: "", poster: "/thumbs/thumb-anee.png", vimeoId: "1203535016", title: "ANEETHUN", brand: "", category: "ads" },
  { src: "", poster: "/thumbs/thumb-graoesabor.png", vimeoId: "1198257104", title: "Grão e Sabor", brand: "", category: "ads" },
  { src: "", poster: "/thumbs/thumb-shortperfumoa.png", vimeoId: "1207556756", title: "Perfumoá", brand: "", category: "ads" },

];

export type PhotoItem = { src: string; full: string; title: string; sub: string };

export const PHOTOS: PhotoItem[] = [
  { src: "/fotos/portfolio(11).jpg",  full: "/fotos/portfolio(11).jpg",  title: "Beth Girl", sub: "" },
  { src: "/fotos/portfolio(16).jpg",   full: "/fotos/portfolio(16).jpg",   title: "Pantene", sub: "" },
  { src: "/fotos/portfolio(5).jpg",  full: "/fotos/portfolio(5).jpg",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(6).jpg",  full: "/fotos/portfolio(6).jpg",  title: "Hollyland", sub: "" },
  { src: "/fotos/portfolio(7).jpg",  full: "/fotos/portfolio(7).jpg",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(8).jpg",  full: "/fotos/portfolio(8).jpg",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio.jpg",     full: "/fotos/portfolio.jpg",     title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(9).jpg",  full: "/fotos/portfolio(9).jpg",  title: "Suerte",   sub: "" },
  { src: "/fotos/portfolio(10).jpg", full: "/fotos/portfolio(10).jpg", title: "Suerte",   sub: "" },
  { src: "/fotos/glow.jpg",          full: "/fotos/glow.jpg",          title: "Glow",     sub: "" },
  { src: "/fotos/labotrat.jpg",      full: "/fotos/labotrat.jpg",      title: "Labotrat", sub: "" },
  { src: "/fotos/labotrat2.jpg",     full: "/fotos/labotrat2.jpg",     title: "Labotrat", sub: "" },
  { src: "/fotos/ju-labotrat.jpg",   full: "/fotos/ju-labotrat.jpg",   title: "Labotrat", sub: "" },
  { src: "/fotos/portfolio(12).jpg",   full: "/fotos/portfolio(12).jpg",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(13).jpg",   full: "/fotos/portfolio(13).jpg",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(14).jpg",   full: "/fotos/portfolio(14).jpg",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(15).jpg",   full: "/fotos/portfolio(15).jpg",   title: "ANEETHUN", sub: "" },
  { src: "/fotos/portfolio(17).jpg",   full: "/fotos/portfolio(17).jpg",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(18).jpg",   full: "/fotos/portfolio(18).jpg",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(19).jpg",   full: "/fotos/portfolio(19).jpg",   title: "Perfumoá", sub: "" },
  { src: "/fotos/portfolio(20).jpg",   full: "/fotos/portfolio(20).jpg",   title: "Perfumoá", sub: "" },

];

export const CLIENTS = {
  c1: "/fotos/clientes/cliente1.jpg",
  c2: "/fotos/clientes/cliente2.jpg",
  c3: "/fotos/clientes/cliente3.jpg",
  c4: "/fotos/aneethun.jpeg",
  c5: "/fotos/perfumoa.jpg",

};

export const WHATSAPP = "5582996241281";