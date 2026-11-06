export interface Testimonial {
  quote: string;
  author: string;
}

// Depoimentos em TEXTO exibidos na seção #depoimentos quando não há vídeos
// (ver lib/videoTestimonials.ts). Mesmos depoimentos que já existiam no
// formulário antigo (app/components/DiagnosticForm.tsx).
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Atendimento excepcional! Equipe extremamente preparada e atenta a cada detalhe do meu escritório.",
    author: "Advogada trabalhista",
  },
  {
    quote:
      "Processo super claro do início ao fim, me senti seguro em cada etapa da conversa.",
    author: "Advogado previdenciário",
  },
  {
    quote:
      "Decisão certeira contratar a Alpha Jurídico: mais segurança, estratégia e resultado.",
    author: "Sócia de escritório",
  },
  {
    quote:
      "Elevaram o nível do marketing do meu escritório, com posicionamento certeiro para o público jurídico.",
    author: "Advogado bancário/consumidor",
  },
  {
    quote:
      "Gestão de tráfego eficiente, focada em atrair clientes qualificados para a minha área de atuação.",
    author: "Advogada de família",
  },
  {
    quote:
      "Ajudaram não só a gerar leads, mas também a converter mais contratos com dicas práticas de vendas.",
    author: "Sócio de escritório",
  },
];
