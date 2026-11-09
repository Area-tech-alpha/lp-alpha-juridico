// Lógica do funil desta LP: validação dos campos, envio do lead aos webhooks,
// evento generate_lead (dataLayer) + Lead (Meta Pixel) e destino após o envio.
// É o mesmo comportamento que ficava em app/components/DiagnosticForm.tsx —
// só foi extraído para cá para que o components/LeadForm.tsx seja idêntico
// nas 3 LPs. Cada LP tem o seu lib/funnel.ts.
import { EMPTY_ATTRIBUTION, readAttribution, type Attribution } from "./attribution";
import {
  FORM_NAME,
  LEAD_ORIGIN,
  LEAD_SOURCE,
  META_PIXEL_ID,
  N8N_WEBHOOK_URL,
} from "./config";
import { isQualified } from "./qualification";
import type { Answers, StepId } from "./steps";

export type FieldErrors = Partial<Record<StepId, string>>;
export type ResultRoute = "/obrigado" | "/agradecimento";

const QUALIFIED_URL: ResultRoute = "/obrigado";
const DISQUALIFIED_URL: ResultRoute = "/agradecimento";

// Estado por montagem do formulário (equivalente aos refs do componente).
export interface LeadSession {
  attribution: Attribution;
  leadFired: boolean;
}

export function createLeadSession(): LeadSession {
  return { attribution: { ...EMPTY_ATTRIBUTION }, leadFired: false };
}

// Chamado uma vez quando o formulário monta. Esta LP não dispara form_view.
export function startLeadSession(session: LeadSession): void {
  session.attribution = readAttribution();
}

export function validateStep(id: StepId, data: Answers): string | null {
  switch (id) {
    case "nome":
      return data.nome.trim().length > 1 ? null : "Digite seu nome completo.";
    case "whatsapp":
      return data.whatsapp.length >= 10 ? null : "Digite um WhatsApp válido com DDD.";
    case "areaAtuacao":
      return data.areaAtuacao !== "" ? null : "Selecione uma opção.";
    case "quantidadeAdvogados":
      return data.quantidadeAdvogados !== "" ? null : "Selecione uma opção.";
    case "faturamento":
      return data.faturamento !== "" ? null : "Selecione uma opção.";
    default:
      return null;
  }
}

// O WhatsApp é guardado (e enviado) só com dígitos; a máscara é só visual.
export function toPhoneValue(input: string): string {
  return input.replace(/\D/g, "").slice(0, 11);
}
export function toPhoneDisplay(digits: string): string {
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${ddd}`;
  if (rest.length <= 5) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

// Verificação assíncrona antes do envio (ex.: Twilio no med). Esta LP não tem.
export type VerifyBeforeSubmit = (answers: Answers) => Promise<FieldErrors | null>;
export const verifyBeforeSubmit: VerifyBeforeSubmit | null = null;

// Dispara webhooks e eventos e devolve a rota de destino.
export function submitLead(finalData: Answers, session: LeadSession): ResultRoute {
  const qualificado = isQualified(finalData);
  const payload = {
    nome: finalData.nome,
    whatsapp: finalData.whatsapp,
    areaAtuacao: finalData.areaAtuacao,
    quantidadeAdvogados: finalData.quantidadeAdvogados,
    faturamento: finalData.faturamento,
    qualificado,
    attribution: session.attribution,
  };

  if (N8N_WEBHOOK_URL) {
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  // O lead vai para a rota do próprio site, que repassa ao CRM com a chave (app/api/lead).
  fetch("/api/lead", {
    method: "POST",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, origem: LEAD_ORIGIN }),
  }).catch(() => {});

  if (!session.leadFired) {
    session.leadFired = true;
    window.dataLayer?.push({
      event: "generate_lead",
      form_name: FORM_NAME,
      source: LEAD_SOURCE,
      qualificado,
      ...session.attribution,
    });
    if (META_PIXEL_ID) {
      window.fbq?.("trackSingle", META_PIXEL_ID, "Lead", { qualificado });
    }
  }

  return qualificado ? QUALIFIED_URL : DISQUALIFIED_URL;
}
