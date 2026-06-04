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
  { src: "", poster: "/thumbs/thumb-nivea.png", vimeoId: "1198257063", title: "Nivea", brand: "Portfólio", category: "portfolio" },
  { src: "", poster: "/thumbs/thumb-labotrat.png", vimeoId: "1198562468", title: "LabPop | Labotrat", brand: "Product Shot", category: "ads" },
  { src: "/videos/video1.mp4", poster: "/fotos/portfolio(1).jpg",  title: "Beth Girl",           brand: "Instagram · Feed", category: "feed" },
  { src: "/videos/video2.mp4", poster: "/fotos/portfolio(2).jpg",  title: "Nivea",               brand: "Portfólio",        category: "portfolio" },
  { src: "/videos/video4.mp4", poster: "/fotos/portfolio(2).jpg",  title: "Beth Girl",           brand: "Instagram · Feed", category: "feed" },
  { src: "/videos/video8.mp4", poster: "/fotos/portfolio(4).JPG",  title: "We Pink",             brand: "Portfólio",        category: "portfolio" },
  { src: "/videos/video6.mp4", poster: "/fotos/portfolio(5).JPG",  title: "Beth Girl",           brand: "Instagram · Feed", category: "feed" },
  { src: "/videos/video7.mp4", poster: "/fotos/portfolio(6).JPG",  title: "Lark M2 - Hollyland", brand: "Portfólio",        category: "ads" },
  { src: "/videos/video9.mp4", poster: "/fotos/portfolio(10).JPG", title: "Suerte",              brand: "Portfólio",        category: "portfolio" },
];

export type PhotoItem = { src: string; full: string; title: string; sub: string };

export const PHOTOS: PhotoItem[] = [
  { src: "/fotos/portfolio(1).jpg",  full: "/fotos/portfolio(1).jpg",  title: "Maria's",   sub: "Product Shot" },
  { src: "/fotos/portfolio(2).jpg",  full: "/fotos/portfolio(2).jpg",  title: "Maria's",   sub: "Product Shot" },
  { src: "/fotos/portfolio(3).jpg",  full: "/fotos/portfolio(3).jpg",  title: "Maria's",   sub: "Product Shot" },
  { src: "/fotos/portfolio(4).JPG",  full: "/fotos/portfolio(4).JPG",  title: "Beth Girl", sub: "Dia dos Namorados" },
  { src: "/fotos/portfolio(5).JPG",  full: "/fotos/portfolio(5).JPG",  title: "We Pink",   sub: "Portfólio" },
  { src: "/fotos/portfolio(6).JPG",  full: "/fotos/portfolio(6).JPG",  title: "Hollyland", sub: "Portfólio" },
  { src: "/fotos/portfolio(7).JPG",  full: "/fotos/portfolio(7).JPG",  title: "We Pink",   sub: "Portfólio" },
  { src: "/fotos/portfolio(8).JPG",  full: "/fotos/portfolio(8).JPG",  title: "We Pink",   sub: "Portfólio" },
  { src: "/fotos/portfolio.JPG",     full: "/fotos/portfolio.JPG",     title: "We Pink",   sub: "Portfólio" },
  { src: "/fotos/portfolio(9).JPG",  full: "/fotos/portfolio(9).JPG",  title: "Suerte",   sub: "Portfólio" },
  { src: "/fotos/portfolio(10).JPG", full: "/fotos/portfolio(10).JPG", title: "Suerte",   sub: "Portfólio" },
  { src: "/fotos/glow.jpg",          full: "/fotos/glow.jpg",          title: "Glow",     sub: "Service Experience" },
  { src: "/fotos/glow2.JPG",         full: "/fotos/glow2.JPG",         title: "Glow",     sub: "Service Experience" },
  { src: "/fotos/labotrat.JPG",      full: "/fotos/labotrat.JPG",      title: "Labotrat", sub: "Product Shot" },
  { src: "/fotos/labotrat2.JPG",     full: "/fotos/labotrat2.JPG",     title: "Labotrat", sub: "Product Shot" },
  { src: "/fotos/ju-labotrat.JPG",   full: "/fotos/ju-labotrat.JPG",   title: "Labotrat", sub: "Product Shot" },

];

export const CLIENTS = {
  c1: "/fotos/clientes/cliente1.jpg",
  c2: "/fotos/clientes/cliente2.jpg",
  c3: "/fotos/clientes/cliente3.jpg",
};

export const WHATSAPP = "5582996241281";