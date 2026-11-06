export interface VideoTestimonial {
  // Nome de quem fala no vídeo. Se vazio, o card mostra só a company.
  name: string;
  company?: string;
  // Frase de resultado exibida no card, acima do nome. Opcional.
  highlight?: string;
  // URL do .mp4 (Vercel Blob: https://<id>.public.blob.vercel-storage.com/...) ou arquivo em /public/videos/.
  videoSrc: string;
  // Capa do card (frame exibido antes do play). Opcional.
  poster?: string;
}

// Depoimentos em vídeo (formato vertical 9:16) da seção #depoimentos.
// Com a lista vazia, a seção some e o hero/footer deixam de apontar para #depoimentos.
// Exemplo:
// { name: "Nome do cliente", company: "Nome da empresa", highlight: "Frase de resultado", videoSrc: "https://<id>.public.blob.vercel-storage.com/Videos/cliente.mp4", poster: "https://<id>.public.blob.vercel-storage.com/Videos/cliente-poster.jpg" },
export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [];
