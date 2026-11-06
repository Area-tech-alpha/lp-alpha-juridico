export type StepId = "nome" | "whatsapp" | "areaAtuacao" | "quantidadeAdvogados" | "faturamento";

export type Answers = Record<StepId, string>;

export const EMPTY_ANSWERS: Answers = {
  nome: "",
  whatsapp: "",
  areaAtuacao: "",
  quantidadeAdvogados: "",
  faturamento: "",
};

// Tipos de campo — iguais nas 3 LPs (o components/LeadForm.tsx é o mesmo).
interface BaseStep {
  id: StepId;
  question: string;
  placeholder: string;
  eyebrow?: string;
}

export interface TextStep extends BaseStep {
  type: "text" | "email" | "tel";
  helperText?: string;
  autoComplete?: string;
}

export interface SelectStep extends BaseStep {
  type: "select";
  options: string[];
}

export type Step = TextStep | SelectStep;

export const AREA_OPTIONS = [
  "TRABALHISTA",
  "PREVIDENCIÁRIO",
  "BANCÁRIO/CONSUMIDOR",
  "FAMÍLIA",
  "CRIMINAL",
  "TRIBUTÁRIO",
  "EMPRESARIAL",
];

export const TEAM_SIZE_OPTIONS = [
  "Acima de 6 advogados",
  "De 3 a 6 advogados",
  "De 1 a 3 advogados",
  "Sou apenas eu",
];

export const REVENUE_OPTIONS = [
  "Mais de R$ 80 mil",
  "De R$ 50 mil a R$ 80 mil",
  "De R$ 20 mil a R$ 50 mil",
  "De R$ 5 mil a R$ 20 mil",
  "De R$ 0 a R$ 5 mil",
];

export const STEPS: Step[] = [
  {
    id: "nome",
    type: "text",
    question: "Qual seu nome?",
    placeholder: "Digite sua resposta...",
    autoComplete: "name",
  },
  {
    id: "whatsapp",
    type: "tel",
    question: "Qual seu WhatsApp?",
    placeholder: "(11) 99999-9999",
    helperText: "Obs.: Não coloque o número do seu escritório.",
    autoComplete: "tel-national",
  },
  {
    id: "areaAtuacao",
    type: "select",
    question: "Qual é a área de atuação do seu escritório?",
    placeholder: "Selecione uma área de atuação",
    options: AREA_OPTIONS,
  },
  {
    id: "quantidadeAdvogados",
    type: "select",
    question: "Quantos advogados você tem no seu escritório?",
    placeholder: "Selecione o tamanho da sua equipe",
    options: TEAM_SIZE_OPTIONS,
  },
  {
    id: "faturamento",
    type: "select",
    question: "Qual faturamento médio mensal do seu escritório?",
    placeholder: "Selecione um faturamento mensal",
    options: REVENUE_OPTIONS,
  },
];
