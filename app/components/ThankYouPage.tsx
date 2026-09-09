import Image from "next/image";

// TODO: trocar SEU_VIDEO_ID_AQUI pelo ID real do vídeo do YouTube.
const YOUTUBE_VIDEO_ID = "SEU_VIDEO_ID_AQUI";

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
            uma conversa. Antes disso, assista ao vídeo abaixo.
          </p>
        </section>

        <section className="thanks-video-card" aria-label="Vídeo de preparação">
          <div className="thanks-video-frame">
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0`}
              title="Como se preparar para o diagnóstico Alpha Jurídico"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="thanks-video-caption">
            <strong>Assista antes da reunião</strong>
            <span>Separe alguns minutos e veja o vídeo até o final.</span>
          </div>
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
