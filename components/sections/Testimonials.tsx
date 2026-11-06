"use client";

// Seção #depoimentos. Prioridade: vídeos (lib/videoTestimonials.ts) →
// depoimentos de texto reais (lib/testimonials.ts). Se as duas listas
// estiverem vazias, app/page.tsx nem renderiza esta seção.
import { useRef, useState } from "react";
import { TESTIMONIALS_SECTION } from "@/lib/landing";
import { TESTIMONIALS } from "@/lib/testimonials";
import { renderAccentText } from "@/lib/text";
import { VIDEO_TESTIMONIALS } from "@/lib/videoTestimonials";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}

export function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  // Só um vídeo fica montado/tocando por vez.
  const [playing, setPlaying] = useState<number | null>(null);
  const hasVideos = VIDEO_TESTIMONIALS.length > 0;

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
          <div className="carousel-arrows">
            <button className="carousel-arrow" type="button" aria-label="Anterior" onClick={() => scroll(-1)}>
              <ArrowIcon direction="left" />
            </button>
            <button className="carousel-arrow" type="button" aria-label="Próximo" onClick={() => scroll(1)}>
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <ul className="carousel" ref={trackRef} aria-label={TESTIMONIALS_SECTION.label}>
          {hasVideos
            ? VIDEO_TESTIMONIALS.map((item, i) => (
                <li className="video-card" key={`${item.videoSrc}-${i}`}>
                  <div className="video-frame">
                    {playing === i ? (
                      <video
                        src={item.videoSrc}
                        poster={item.poster}
                        controls
                        playsInline
                        autoPlay
                        preload="metadata"
                        onEnded={() => setPlaying(null)}
                      />
                    ) : (
                      <button
                        className="video-poster-button"
                        type="button"
                        aria-label={`Assistir depoimento de ${item.name}`}
                        onClick={() => setPlaying(i)}
                      >
                        {item.poster ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.poster} alt="" loading="lazy" />
                        ) : null}
                        <span className="video-play">
                          <PlayIcon />
                        </span>
                      </button>
                    )}
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
