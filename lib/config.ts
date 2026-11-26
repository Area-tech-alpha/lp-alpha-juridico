// Configuração de marca e integrações da LP Alpha Jurídico. Valores que antes
// ficavam fixos dentro de app/components/DiagnosticForm.tsx foram mantidos
// iguais; só GTM e Meta Pixel vêm de env vars (ver .env.local).

export const BRAND_NAME = "Alpha Jurídico";
export const BRAND_HEADLINE = "A Maior Assessoria de Marketing Nichada da América Latina!";
export const BRAND_DESCRIPTION =
  "Uma análise estratégica para identificar os gargalos que impedem o crescimento do seu escritório.";

// Redes sociais (rodapé da landing e página /agradecimento).
export const SOCIAL_YOUTUBE_URL = "https://www.youtube.com/@assessorialpha";
export const SOCIAL_INSTAGRAM_URL = "https://www.instagram.com/assessorialpha/";

// Tracking — em branco = evento não é disparado.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

// Identificação do formulário no evento generate_lead (dataLayer).
export const FORM_NAME = "diagnostico_alpha_juridico";
export const LEAD_SOURCE = "site";

export const LEAD_ORIGIN = "juridico";
