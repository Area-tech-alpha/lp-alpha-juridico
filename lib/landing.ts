// =============================================================
// Todo o TEXTO DO NICHO desta LP. Os componentes em
// components/sections/ e components/LeadForm.tsx são idênticos nas 3 LPs
// da Alpha (iphone, med, jurídico) — o que muda entre elas é este arquivo
// + lib/steps.ts, lib/qualification.ts, lib/config.ts e lib/funnel.ts.
//
// Trechos entre *asteriscos* viram destaque em amarelo (ver lib/text.tsx).
// =============================================================
import { BRAND_DESCRIPTION, BRAND_HEADLINE, BRAND_NAME } from "./config";

export interface LandingImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// Nicho no plural, usado em várias frases ("para lojas de iPhone").
const NICHE = "escritórios de advocacia";

export const SEO = {
  title: `Marketing para escritórios de advocacia | ${BRAND_NAME}`,
  description:
    "Tráfego pago, criativos e comunicação comercial para escritórios de advocacia que querem fechar mais contratos. Fale com um especialista da Alpha.",
};

// Logo usada no header e no rodapé (versão para fundo escuro).
export const LOGO: LandingImage = {
  src: "/alpha-logo-white.png",
  alt: BRAND_NAME,
  width: 134,
  height: 38,
};

export const TOP_TICKER = "A MAIOR ASSESSORIA DE MARKETING NICHADA DA AMÉRICA LATINA";

export const HERO = {
  title: "Fazemos seu escritório fechar mais contratos com o *time de marketing da Alpha.*",
  subtitle: BRAND_HEADLINE,
  primaryCta: "Quero vender mais",
  methodCta: "Ver o método",
  resultsCta: "Resultados Alpha",
  steps: [
    "Preencha o formulário em menos de 1 minuto",
    "Um especialista da Alpha entra em contato com você",
  ],
};

export const FORM = {
  eyebrow: "Preencha e um especialista entra em contato",
  title: "Quero saber mais",
  submit: "Quero falar com um especialista",
  verifying: "Validando WhatsApp...",
  consent: `Ao continuar, você concorda em receber mensagens de marketing por SMS e e-mail da ${BRAND_NAME}.`,
};

export const SERVICES_TICKER = [
  `Tráfego pago especializado para ${NICHE}`,
  "Criativos no formato certo",
  "Campanhas direcionadas",
];

export const TESTIMONIALS_SECTION = {
  label: "Depoimentos",
  title: "Método testado e aprovado. *Quem fez, conta como foi.*",
};

export const ABOUT = {
  label: "Quem somos",
  title: "Cuidamos da parte que faz o escritório *vender.*",
  paragraphs: [
    `A ${BRAND_NAME} cuida de tráfego pago, criativos e comunicação comercial com foco em ${NICHE}. Você segue cuidando dos casos; a gente cuida da parte que traz o cliente até o seu escritório.`,
    BRAND_DESCRIPTION,
  ],
  cta: "Quero meu diagnóstico",
  // Slot opcional de imagem — só aparece se for preenchido.
  image: null as LandingImage | null,
};

// TODO validar copy com o time
export const METHOD = {
  title: "Método *Alpha*",
  subtitle: `Geração de demanda para ${NICHE}`,
  steps: [
    {
      letter: "A",
      number: "01",
      title: "Análise da operação",
      text: "Olhamos oferta, preço, anúncios anteriores e onde as vendas travam.",
    },
    {
      letter: "L",
      number: "02",
      title: "Linha de aquisição",
      text: "Definimos público, mensagem e canal, priorizando quem já está procurando.",
    },
    {
      letter: "P",
      number: "03",
      title: "Produção e campanhas no ar",
      text: "Criativos no formato certo, campanhas publicadas e testes de oferta, ângulo e público.",
    },
    {
      letter: "H",
      number: "04",
      title: "Histórico de números",
      text: "Acompanhamento semanal de custo por lead e por venda.",
    },
    {
      letter: "A",
      number: "05",
      title: "Aceleração",
      text: "Mais verba no que performa, corte no que não performa.",
    },
  ],
};

// TODO validar respostas com o time
export const FAQ = {
  title: "Perguntas *frequentes*",
  items: [
    {
      question: "O que a Alpha faz?",
      answer: `A ${BRAND_NAME} é uma assessoria de marketing nichada: cuidamos de tráfego pago, criativos e comunicação comercial para ${NICHE} que querem fechar mais contratos.`,
    },
    {
      question: "Como funciona depois que eu preencho o formulário?",
      answer:
        "Um especialista da Alpha entra em contato com você para entender o seu negócio, o momento do seu escritório e onde estão as oportunidades de crescimento.",
    },
    {
      question: "A Alpha cuida do Instagram e das redes?",
      answer:
        "Sim, com foco em venda: os criativos e a comunicação nas redes são pensados para atrair clientes, e não só para gerar curtidas.",
    },
  ],
};

export const FOOTER = {
  tagline: `Tráfego pago, criativos e comunicação comercial para ${NICHE} que querem fechar mais contratos.`,
};
