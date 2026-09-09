import type { Metadata } from "next";
import AgradecimentoPage from "../components/AgradecimentoPage";

export const metadata: Metadata = {
  title: "Agradecimento | Alpha Jurídico",
  description: "Obrigado pelo interesse na Alpha Jurídico.",
  openGraph: {
    title: "Agradecimento | Alpha Jurídico",
    description: "Obrigado pelo interesse na Alpha Jurídico.",
    url: "/agradecimento",
  },
};

export default function Page() {
  return <AgradecimentoPage />;
}
