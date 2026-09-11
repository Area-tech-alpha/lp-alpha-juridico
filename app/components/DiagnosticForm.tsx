"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

type FormData = {
  nome: string;
  whatsapp: string;
  email: string;
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

const TOTAL_STEPS = 6;

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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export default function DiagnosticForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [data, setData] = useState<FormData>({
    nome: "",
    whatsapp: "",
    email: "",
    areaAtuacao: "",
    quantidadeAdvogados: "",
    faturamento: "",
  });

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

  const isValid = useMemo(() => {
    switch (step) {
      case 0:
        return data.nome.trim().length > 1;
      case 1:
        return data.whatsapp.length >= 10;
      case 2:
        return EMAIL_REGEX.test(data.email.trim());
      case 3:
        return data.areaAtuacao !== "";
      case 4:
        return data.quantidadeAdvogados !== "";
      case 5:
        return data.faturamento !== "";
      default:
        return false;
    }
  }, [step, data]);

  const showError = attemptedStep === step && !isValid;
  const errorMessage = [
    "Digite seu nome completo.",
    "Digite um WhatsApp válido com DDD.",
    "Digite um e-mail válido.",
    "Selecione uma opção.",
    "Selecione uma opção.",
    "Selecione uma opção.",
  ][step];

  const firstName = data.nome.trim().split(" ")[0] || "";

  const eyebrow = [
    "Bom ter você aqui !",
    `Prazer, ${firstName}!`,
    "Agora precisamos do seu melhor contato profissional.",
    "Vamos conhecer melhor o seu escritório.",
    "Conte um pouco sobre a estrutura atual.",
    "Falta pouco para concluirmos seu diagnóstico.",
  ][step];

  const question = [
    "Qual seu nome?",
    "Qual seu WhatsApp?",
    "Digite seu melhor e-mail:",
    "Qual é a área de atuação do seu escritório?",
    "Quantos advogados você tem no seu escritório?",
    "Qual faturamento médio mensal do seu escritório?",
  ][step];

  function goBack() {
    if (step === 0) return;
    setAttemptedStep(null);
    setStep((s) => s - 1);
  }

  function submitLead() {
    const qualificado = data.quantidadeAdvogados !== DISQUALIFYING_TEAM_SIZE;
    const payload = {
      nome: data.nome,
      whatsapp: data.whatsapp,
      email: data.email,
      areaAtuacao: data.areaAtuacao,
      quantidadeAdvogados: data.quantidadeAdvogados,
      faturamento: data.faturamento,
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

  function goNext() {
    if (!isValid) {
      setAttemptedStep(step);
      return;
    }
    if (step === TOTAL_STEPS - 1) {
      submitLead();
      return;
    }
    setAttemptedStep(null);
    setStep((s) => s + 1);
  }

  const testimonial = TESTIMONIALS[step];
  const progressPercent = (step / TOTAL_STEPS) * 100;

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
        <div className="progress-track" aria-hidden="true">
          <span style={{ height: `${progressPercent}%` }} />
        </div>

        <header className="form-header">
          <button
            className="back-button"
            type="button"
            onClick={goBack}
            disabled={step === 0}
            aria-label="Voltar para a etapa anterior"
          >
            ←
          </button>
          <img className="brand-mark" src="/alpha-mark-icon.png" alt="Alpha Jurídico" />
        </header>

        <div className="content-stack">
          <form
            className="question-card"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              goNext();
            }}
          >
            <div className="question-copy">
              <p className="eyebrow">{eyebrow}</p>
              <h1>{question}</h1>
            </div>

            <StepField
              step={step}
              data={data}
              setData={setData}
              showError={showError}
            />
            <p className="error-message" role="alert">
              {showError ? errorMessage : ""}
            </p>

            <div className="action-row">
              <button className="primary-button" type="submit">
                {step === TOTAL_STEPS - 1 ? "ENVIAR" : "CONFIRMAR"}
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

function StepField({
  step,
  data,
  setData,
  showError,
}: {
  step: number;
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  showError: boolean;
}) {
  if (step === 0) {
    return (
      <div className="field-group">
        <input
          type="text"
          autoFocus
          placeholder="Digite sua resposta..."
          aria-label="Digite sua resposta..."
          aria-invalid={showError}
          autoComplete="name"
          value={data.nome}
          onChange={(e) => setData((d) => ({ ...d, nome: e.target.value }))}
        />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="field-group">
        <div className="phone-control">
          <span className="phone-prefix">+55</span>
          <input
            type="tel"
            autoFocus
            placeholder="(11) 99999-9999"
            aria-label="Qual seu WhatsApp?"
            aria-invalid={showError}
            autoComplete="tel-national"
            value={formatPhoneDisplay(data.whatsapp)}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                whatsapp: e.target.value.replace(/\D/g, "").slice(0, 11),
              }))
            }
          />
        </div>
        <p className="helper-text">Obs.: Não coloque o número do seu escritório.</p>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="field-group">
        <input
          type="email"
          autoFocus
          placeholder="seuemail@escritorio.com"
          aria-label="Digite seu melhor e-mail"
          aria-invalid={showError}
          autoComplete="email"
          value={data.email}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
        />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="field-group">
        <ChoiceGrid
          options={AREA_OPTIONS}
          selected={data.areaAtuacao}
          onSelect={(v) => setData((d) => ({ ...d, areaAtuacao: v }))}
        />
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="field-group">
        <ChoiceGrid
          options={TEAM_SIZE_OPTIONS}
          selected={data.quantidadeAdvogados}
          onSelect={(v) => setData((d) => ({ ...d, quantidadeAdvogados: v }))}
        />
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="field-group">
        <ChoiceGrid
          options={REVENUE_OPTIONS}
          selected={data.faturamento}
          onSelect={(v) => setData((d) => ({ ...d, faturamento: v }))}
        />
      </div>
    );
  }

  return null;
}

function ChoiceGrid({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="choice-grid">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`choice-button${selected === opt ? " selected" : ""}`}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
