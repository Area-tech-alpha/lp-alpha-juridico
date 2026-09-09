import type { Metadata } from "next";
import ThankYouPage from "../components/ThankYouPage";

export const metadata: Metadata = {
  title: "Diagnóstico recebido | Alpha Jurídico",
  description:
    "Recebemos seu diagnóstico e nossa equipe vai entrar em contato em breve.",
  openGraph: {
    title: "Diagnóstico recebido | Alpha Jurídico",
    description:
      "Recebemos seu diagnóstico e nossa equipe vai entrar em contato em breve.",
    url: "/obrigado",
  },
};

export default function ObrigadoPage() {
  return <ThankYouPage />;
}
