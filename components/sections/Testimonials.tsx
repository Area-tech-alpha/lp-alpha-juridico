"use client";

// Seção #depoimentos. Prioridade: vídeos (lib/videoTestimonials.ts) →
// depoimentos de texto reais (lib/testimonials.ts). Se as duas listas
// estiverem vazias, app/page.tsx nem renderiza esta seção.
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { TESTIMONIALS_SECTION } from "@/lib/landing";
import { TESTIMONIALS } from "@/lib/testimonials";
import { renderAccentText } from "@/lib/text";
import { VIDEO_TESTIMONIALS, type VideoTestimonial } from "@/lib/videoTestimonials";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}

// Faixa de antecedência: o início do vídeo é buscado quando a seção está a ~200px da tela.
const PRELOAD_ROOT_MARGIN = "200px 0px";

// navigator.connection (Network Information API) ainda não está nos tipos do TS.
type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

// Economia de dados ligada ou rede 2G: não pré-carrega nada (baixa só no clique).
function shouldSkipPreload(): boolean {
  const connection = (navigator as NavigatorWithConnection).connection;
  if (!connection) return false;
  return connection.saveData === true || connection.effectiveType === "2g" || connection.effectiveType === "slow-2g";
}

interface VideoCardProps {
  item: VideoTestimonial;
  onPlay: (event: SyntheticEvent<HTMLVideoElement>) => void;
}

function VideoCard({ item, onPlay }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // started: o usuário já clicou no play (aí entram os controles nativos).
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  // Fonte atual do vídeo/capa: começa no Blob e cai para a cópia local se falhar.
  const [videoSrc, setVideoSrc] = useState(item.videoSrc);
  const [poster, setPoster] = useState(item.poster);
  const switchedToFallback = useRef(false);
  const label = item.name || item.company || "cliente";

  // Pré-teste da capa: se a URL principal não carregar, usa a cópia local.
  useEffect(() => {
    if (!item.poster || !item.posterFallback || item.poster === item.posterFallback) return;
    const fallback = item.posterFallback;
    const probe = new Image();
    probe.onerror = () => setPoster(fallback);
    probe.src = item.poster;
    return () => {
      probe.onerror = null;
    };
  }, [item.poster, item.posterFallback]);

  // Depois de trocar para o fallback: recarrega e, se a pessoa já tinha
  // clicado, retoma o play.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !switchedToFallback.current) return;
    video.load();
    if (!video.dataset.started) return;
    video.play().catch(() => {
      delete video.dataset.started;
      setStarted(false);
      setLoading(false);
    });
  }, [videoSrc]);

  function backToOverlay() {
    const video = videoRef.current;
    if (video) delete video.dataset.started;
    setStarted(false);
    setLoading(false);
  }

  // Erro na fonte principal (ex.: Blob bloqueado/fora do ar): troca para a
  // cópia local em public/videos/. Só uma vez por vídeo.
  function handleError() {
    if (switchedToFallback.current || !item.videoFallback || videoSrc === item.videoFallback) {
      setLoading(false);
      return;
    }
    switchedToFallback.current = true;
    setVideoSrc(item.videoFallback);
  }

  function start() {
    const video = videoRef.current;
    if (!video) return;
    video.dataset.started = "true";
    setStarted(true);
    // Sem dados suficientes para tocar já: mostra o spinner até o "playing".
    if (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) setLoading(true);
    video.play().catch(() => {
      // Se a falha foi da fonte principal, o handleError já trocou para o
      // fallback e vai retomar o play; senão, volta para o overlay.
      if (switchedToFallback.current && video.dataset.started) return;
      backToOverlay();
    });
  }

  function showSpinner() {
    if (videoRef.current?.dataset.started) setLoading(true);
  }

  return (
    <li className="video-card">
      <div className="video-frame">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          controls={started}
          playsInline
          preload="none"
          aria-label={`Depoimento de ${label}`}
          onPlay={onPlay}
          onLoadStart={showSpinner}
          onWaiting={showSpinner}
          onPlaying={() => setLoading(false)}
          onError={handleError}
        />
        {started ? null : (
          <button className="video-overlay" type="button" aria-label={`Assistir depoimento de ${label}`} onClick={start}>
            <span className="video-play">
              <PlayIcon />
            </span>
          </button>
        )}
        {started && loading ? <span className="video-spinner" role="status" aria-label="Carregando vídeo" /> : null}
      </div>
      <div className="video-meta">
        {item.highlight ? <p className="video-highlight">{item.highlight}</p> : null}
        {item.name ? (
          <>
            <strong>{item.name}</strong>
            {item.company ? <span>{item.company}</span> : null}
          </>
        ) : item.company ? (
          <strong>{item.company}</strong>
        ) : null}
      </div>
    </li>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const hasVideos = VIDEO_TESTIMONIALS.length > 0;
  const count = hasVideos ? VIDEO_TESTIMONIALS.length : TESTIMONIALS.length;
  // Com até 3 cards não há o que rolar no desktop: centraliza e some com as setas.
  const isFew = count <= 3;

  // Os vídeos nascem com preload="none" (não pesam no carregamento da página).
  // Só depois do 1º scroll (para não competir com o carregamento inicial nem
  // com o formulário) é armado um observer: quando a seção está chegando, passa
  // para preload="metadata" e chama load() uma vez, sem play — o navegador
  // busca só o início do arquivo, e o clique já encontra o vídeo pronto.
  useEffect(() => {
    const section = sectionRef.current;
    if (!hasVideos || !section || !("IntersectionObserver" in window) || shouldSkipPreload()) return;

    let observer: IntersectionObserver | null = null;
    function arm() {
      if (!section) return;
      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          section.querySelectorAll("video").forEach((video) => {
            if (video.dataset.started) return;
            video.preload = "metadata";
            video.load();
          });
        },
        { rootMargin: PRELOAD_ROOT_MARGIN },
      );
      observer.observe(section);
    }

    window.addEventListener("scroll", arm, { once: true, passive: true });
    return () => {
      window.removeEventListener("scroll", arm);
      observer?.disconnect();
    };
  }, [hasVideos]);

  // Só um vídeo toca por vez: ao dar play em um, pausa os outros.
  function handlePlay(event: SyntheticEvent<HTMLVideoElement>) {
    trackRef.current?.querySelectorAll("video").forEach((video) => {
      if (video !== event.currentTarget) video.pause();
    });
  }

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section className="section" id="depoimentos" ref={sectionRef}>
      <div className="container">
        <div className="testimonials-head">
          <div>
            <p className="section-label">{TESTIMONIALS_SECTION.label}</p>
            <h2 className="section-title">{renderAccentText(TESTIMONIALS_SECTION.title)}</h2>
          </div>
          {isFew ? null : (
            <div className="carousel-arrows">
              <button className="carousel-arrow" type="button" aria-label="Anterior" onClick={() => scroll(-1)}>
                <ArrowIcon direction="left" />
              </button>
              <button className="carousel-arrow" type="button" aria-label="Próximo" onClick={() => scroll(1)}>
                <ArrowIcon direction="right" />
              </button>
            </div>
          )}
        </div>

        <ul className={isFew ? "carousel is-few" : "carousel"} ref={trackRef} aria-label={TESTIMONIALS_SECTION.label}>
          {hasVideos
            ? VIDEO_TESTIMONIALS.map((item, i) => (
                <VideoCard key={`${item.videoSrc}-${i}`} item={item} onPlay={handlePlay} />
              ))
            : TESTIMONIALS.map((item) => (
                <li key={item.quote}>
                  <figure className="text-card">
                    <span className="text-card-quote" aria-hidden="true">
                      &ldquo;
                    </span>
                    <blockquote>{item.quote}</blockquote>
                    <figcaption>{item.author}</figcaption>
                  </figure>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
