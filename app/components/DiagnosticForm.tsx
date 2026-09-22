"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

type FormData = {
  nome: string;
  whatsapp: string;
  areaAtuacao: string;
  quantidadeAdvogados: string;
  faturamento: string;
};

type Attribution = {
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

type Testimonial = { quote: string; author: string };

const AREA_OPTIONS = [
  "TRABALHISTA",
  "PREVIDENCIÁRIO",
  "BANCÁRIO/CONSUMIDOR",
  "FAMÍLIA",
  "CRIMINAL",
  "TRIBUTÁRIO",
  "EMPRESARIAL",
];

const TEAM_SIZE_OPTIONS = [
  "Acima de 6 advogados",
  "De 3 a 6 advogados",
  "De 1 a 3 advogados",
  "Sou apenas eu",
];

// Only "Sou apenas eu" disqualifies the lead; the other three team sizes
// qualify. This must never be surfaced to the visitor.
const DISQUALIFYING_TEAM_SIZE = "Sou apenas eu";

const REVENUE_OPTIONS = [
  "Mais de R$ 80 mil",
  "De R$ 50 mil a R$ 80 mil",
  "De R$ 20 mil a R$ 50 mil",
  "De R$ 5 mil a R$ 20 mil",
  "De R$ 0 a R$ 5 mil",
];

const TESTIMONIALS: Testimonial[] = [
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

const QUALIFIED_URL = "/obrigado";
const DISQUALIFIED_URL = "/agradecimento";

const ORIGEM = "juridico";
const LEAD_WEBHOOK_URL =
  "https://webhook3.assessorialpha.com/webhook/197edb9e-9848-472f-8aaa-76bed45da2a5";

function formatPhoneDisplay(digits: string) {
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${ddd}`;
  if (rest.length <= 5) return `(${ddd}) ${rest}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

function readAttribution(): Attribution {
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

function validateField(id: keyof FormData, data: FormData): string | null {
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

export default function DiagnosticForm() {
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    nome: "",
    whatsapp: "",
    areaAtuacao: "",
    quantidadeAdvogados: "",
    faturamento: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const attributionRef = useRef<Attribution>({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    meta_campaign_id: null,
    meta_adset_id: null,
    meta_ad_id: null,
    landing_page: "",
  });
  const hasFiredLeadEventRef = useRef(false);

  useEffect(() => {
    attributionRef.current = readAttribution();
  }, []);

  function updateField(id: keyof FormData, value: string) {
    setData((d) => ({ ...d, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: undefined }));
  }

  function submitLead(finalData: FormData) {
    const qualificado = finalData.quantidadeAdvogados !== DISQUALIFYING_TEAM_SIZE;
    const payload = {
      nome: finalData.nome,
      whatsapp: finalData.whatsapp,
      areaAtuacao: finalData.areaAtuacao,
      quantidadeAdvogados: finalData.quantidadeAdvogados,
      faturamento: finalData.faturamento,
      qualificado,
      attribution: attributionRef.current,
    };

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => { });
    }

    fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, origem: ORIGEM }),
    }).catch(() => { });

    if (!hasFiredLeadEventRef.current) {
      hasFiredLeadEventRef.current = true;
      window.dataLayer?.push({
        event: "generate_lead",
        form_name: "diagnostico_alpha_juridico",
        source: "site",
        qualificado,
        ...attributionRef.current,
      });
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      if (pixelId) {
        window.fbq?.("trackSingle", pixelId, "Lead", { qualificado });
      }
    }

    router.push(qualificado ? QUALIFIED_URL : DISQUALIFIED_URL);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fields: (keyof FormData)[] = [
      "nome",
      "whatsapp",
      "areaAtuacao",
      "quantidadeAdvogados",
      "faturamento",
    ];
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    for (const field of fields) {
      const err = validateField(field, data);
      if (err) nextErrors[field] = err;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    submitLead(data);
  }

  const testimonial = TESTIMONIALS[0];

  return (
    <main className="form-shell">
      <aside className="brand-panel" aria-label="Alpha Jurídico">
        <div className="brand-panel-content">
          <img
            className="brand-panel-logo"
            src="/alpha-mark-icon.png"
            alt="Alpha Jurídico"
          />
          <div className="brand-panel-copy">
            <h2>A Maior Assessoria de Marketing Nichada da América Latina!</h2>
            <p>
              Uma análise estratégica para identificar os gargalos que
              impedem o crescimento do seu escritório.
            </p>
          </div>
          <div className="brand-pill-row" aria-label="Pilares da análise">
            <span>Demanda qualificada</span>
            <span>Previsibilidade</span>
            <span>Estratégia</span>
          </div>
        </div>
      </aside>

      <section className="form-panel">
        <header className="form-header">
          <img className="brand-mark" src="/alpha-mark-icon.png" alt="Alpha Jurídico" />
        </header>

        <div className="content-stack">
          <form className="question-card compact-form" noValidate onSubmit={handleSubmit}>
            <div className="question-copy">
              <p className="eyebrow">Preencha e um especialista entra em contato</p>
              <h1>Quero saber mais</h1>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="nome">Qual seu nome?</label>
              <input
                id="nome"
                type="text"
                placeholder="Digite sua resposta..."
                required
                aria-invalid={Boolean(errors.nome)}
                autoComplete="name"
                value={data.nome}
                onChange={(e) => updateField("nome", e.target.value)}
              />
              {errors.nome ? <p className="error-message" role="alert">{errors.nome}</p> : null}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="whatsapp">Qual seu WhatsApp?</label>
              <div className="phone-control">
                <span className="phone-prefix">+55</span>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  required
                  aria-invalid={Boolean(errors.whatsapp)}
                  autoComplete="tel-national"
                  value={formatPhoneDisplay(data.whatsapp)}
                  onChange={(e) =>
                    updateField("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                />
              </div>
              <p className="helper-text">Obs.: Não coloque o número do seu escritório.</p>
              {errors.whatsapp ? <p className="error-message" role="alert">{errors.whatsapp}</p> : null}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="areaAtuacao">Qual é a área de atuação do seu escritório?</label>
              <select
                id="areaAtuacao"
                value={data.areaAtuacao}
                required
                aria-invalid={Boolean(errors.areaAtuacao)}
                onChange={(e) => updateField("areaAtuacao", e.target.value)}
              >
                <option value="" disabled>Selecione uma área de atuação</option>
                {AREA_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.areaAtuacao ? <p className="error-message" role="alert">{errors.areaAtuacao}</p> : null}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="quantidadeAdvogados">Quantos advogados você tem no seu escritório?</label>
              <select
                id="quantidadeAdvogados"
                value={data.quantidadeAdvogados}
                required
                aria-invalid={Boolean(errors.quantidadeAdvogados)}
                onChange={(e) => updateField("quantidadeAdvogados", e.target.value)}
              >
                <option value="" disabled>Selecione o tamanho da sua equipe</option>
                {TEAM_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.quantidadeAdvogados ? <p className="error-message" role="alert">{errors.quantidadeAdvogados}</p> : null}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="faturamento">Qual faturamento médio mensal do seu escritório?</label>
              <select
                id="faturamento"
                value={data.faturamento}
                required
                aria-invalid={Boolean(errors.faturamento)}
                onChange={(e) => updateField("faturamento", e.target.value)}
              >
                <option value="" disabled>Selecione um faturamento mensal</option>
                {REVENUE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.faturamento ? <p className="error-message" role="alert">{errors.faturamento}</p> : null}
            </div>

            <div className="action-row">
              <button className="primary-button" type="submit">
                ENVIAR
                <span>→</span>
              </button>
            </div>
          </form>

          <article className="testimonial-card">
            <div className="testimonial-copy">
              <span className="quote-mark">“</span>
              <p>{testimonial.quote}</p>
            </div>
            <footer>{testimonial.author}</footer>
          </article>
        </div>

        <footer className="legal-footer">
          <p>
            Ao continuar, você concorda em receber mensagens de marketing por
            SMS e e-mail da Alpha Jurídico.
          </p>
          <span>© 2026 Alpha Jurídico</span>
        </footer>
      </section>
    </main>
  );
}
