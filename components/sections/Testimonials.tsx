"use client";

// Seção #depoimentos. Prioridade: vídeos (lib/videoTestimonials.ts) →
// depoimentos de texto reais (lib/testimonials.ts). Se as duas listas
// estiverem vazias, app/page.tsx nem renderiza esta seção.
import { useRef, type SyntheticEvent } from "react";
import { TESTIMONIALS_SECTION } from "@/lib/landing";
import { TESTIMONIALS } from "@/lib/testimonials";
import { renderAccentText } from "@/lib/text";
import { VIDEO_TESTIMONIALS } from "@/lib/videoTestimonials";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const hasVideos = VIDEO_TESTIMONIALS.length > 0;
  const count = hasVideos ? VIDEO_TESTIMONIALS.length : TESTIMONIALS.length;
  // Com até 2 cards não há o que rolar no desktop: centraliza e some com as setas.
  const isFew = count <= 2;

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
    <section className="section" id="depoimentos">
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
                <li className="video-card" key={`${item.videoSrc}-${i}`}>
                  <div className="video-frame">
                    <video
                      src={item.videoSrc}
                      poster={item.poster}
                      controls
                      playsInline
                      preload="none"
                      aria-label={`Depoimento de ${item.name}`}
                      onPlay={handlePlay}
                    />
                  </div>
                  <div className="video-meta">
                    <strong>{item.name}</strong>
                    {item.company ? <span>{item.company}</span> : null}
                  </div>
                </li>
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
