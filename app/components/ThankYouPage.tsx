import Image from "next/image";

// Rendered identically by both /obrigado and /agradecimento — the route is
// the only thing that differs, and only for internal analytics/CRM. Never
// add a prop here that changes what the visitor sees.
export default function ThankYouPage() {
  return (
    <main className="thanks-page">
      <div className="thanks-shell">
        <header className="thanks-header">
          <Image
            src="/alpha-mark-icon.png"
            alt="Alpha Jurídico"
            width={40}
            height={40}
          />
        </header>

        <section className="thanks-hero">
          <p className="eyebrow">Próximo passo</p>
          <h1>Obrigado. Recebemos seu diagnóstico.</h1>
          <p className="thanks-intro">
            Recebemos suas respostas. Nossa equipe vai analisar o cenário do
            seu escritório e entrar em contato pelo WhatsApp para agendar
            uma conversa.
          </p>
        </section>

        <section className="thanks-process-card">
          <div className="thanks-process-heading">
            <p className="eyebrow">O que acontece agora</p>
            <h2>Vamos preparar o seu diagnóstico.</h2>
          </div>
          <ol className="thanks-steps">
            <li>
              <span>01</span>
              <p>Revisamos suas respostas e o cenário atual do seu escritório.</p>
            </li>
            <li>
              <span>02</span>
              <p>Organizamos as prioridades de demanda, previsibilidade e estratégia.</p>
            </li>
            <li>
              <span>03</span>
              <p>Nossa equipe entra em contato pelo WhatsApp para agendar sua conversa.</p>
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
