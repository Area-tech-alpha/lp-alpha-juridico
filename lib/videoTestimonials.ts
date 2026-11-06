export interface VideoTestimonial {
  name: string;
  company?: string;
  // Arquivo em /public/videos/ (ex.: "/videos/cliente.mp4") ou URL externa de um .mp4.
  videoSrc: string;
  // Capa do card (ex.: "/videos/cliente.jpg"). Opcional — sem capa, o card
  // mostra um fundo escuro com o botão de play.
  poster?: string;
}

// Depoimentos em vídeo (formato vertical 9:16) da seção #depoimentos.
// Exemplo:
// { name: "Nome do cliente", company: "Nome da empresa", videoSrc: "/videos/cliente.mp4", poster: "/videos/cliente.jpg" },
export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [];
