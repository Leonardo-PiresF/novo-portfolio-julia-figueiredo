// Media references from the original site. Place actual files under /public
// using the same paths so they resolve at runtime.

export const PROFILE = {
  hero: "/fotos/julia-perfil.JPG",
  about1: "/fotos/julia-sobre.JPG",
  about2: "/fotos/julia-sobremini2.JPG",
  product: "/fotos/julia-produto.JPG",
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
  { src: "", poster: "/thumbs/thumb-glow.png", vimeoId: "1198258432", title: "Glow Concept", brand: "", category: "ads" },
  { src: "/videos/video1.mp4", poster: "/fotos/portfolio(1).jpg",  title: "Beth Girl",           brand: "", category: "feed" },
  { src: "/videos/video6.mp4", poster: "/fotos/portfolio(5).JPG",  title: "Beth Girl",           brand: "", category: "feed" },
  { src: "/videos/video9.mp4", poster: "/fotos/portfolio(10).JPG", title: "Suerte",              brand: "",        category: "portfolio" },
];

export type PhotoItem = { src: string; full: string; title: string; sub: string };

export const PHOTOS: PhotoItem[] = [
  { src: "/fotos/portfolio(4).JPG",  full: "/fotos/portfolio(4).JPG",  title: "Beth Girl", sub: "" },
  { src: "/fotos/portfolio(11).jpg",   full: "/fotos/portfolio(11).jpg",   title: "Labotrat", sub: "" },
  { src: "/fotos/portfolio(5).JPG",  full: "/fotos/portfolio(5).JPG",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(6).JPG",  full: "/fotos/portfolio(6).JPG",  title: "Hollyland", sub: "" },
  { src: "/fotos/portfolio(7).JPG",  full: "/fotos/portfolio(7).JPG",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(8).JPG",  full: "/fotos/portfolio(8).JPG",  title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio.JPG",     full: "/fotos/portfolio.JPG",     title: "We Pink",   sub: "" },
  { src: "/fotos/portfolio(9).JPG",  full: "/fotos/portfolio(9).JPG",  title: "Suerte",   sub: "" },
  { src: "/fotos/portfolio(10).JPG", full: "/fotos/portfolio(10).JPG", title: "Suerte",   sub: "" },
  { src: "/fotos/glow.jpg",          full: "/fotos/glow.jpg",          title: "Glow",     sub: "" },
  { src: "/fotos/labotrat.JPG",      full: "/fotos/labotrat.JPG",      title: "Labotrat", sub: "" },
  { src: "/fotos/labotrat2.JPG",     full: "/fotos/labotrat2.JPG",     title: "Labotrat", sub: "" },
  { src: "/fotos/ju-labotrat.JPG",   full: "/fotos/ju-labotrat.JPG",   title: "Labotrat", sub: "" },

];

export const CLIENTS = {
  c1: "/fotos/clientes/cliente1.jpg",
  c2: "/fotos/clientes/cliente2.jpg",
  c3: "/fotos/clientes/cliente3.jpg",
};

export const WHATSAPP = "5582996241281";