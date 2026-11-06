export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  meta_campaign_id: string | null;
  meta_adset_id: string | null;
  meta_ad_id: string | null;
  landing_page: string;
};

// Valor inicial antes do formulário montar (parâmetros ausentes = null).
export const EMPTY_ATTRIBUTION: Attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  meta_campaign_id: null,
  meta_adset_id: null,
  meta_ad_id: null,
  landing_page: "",
};

// Lê UTMs e parâmetros de Meta Ads da query string da página.
export function readAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    meta_campaign_id: params.get("meta_campaign_id"),
    meta_adset_id: params.get("meta_adset_id"),
    meta_ad_id: params.get("meta_ad_id"),
    landing_page: window.location.href,
  };
}
