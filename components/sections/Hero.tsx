import { LeadForm } from "@/components/LeadForm";
import { HERO } from "@/lib/landing";
import { renderAccentText } from "@/lib/text";

function FormIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z" />
      <path d="M9 11h.01M12 11h.01M15 11h.01" />
    </svg>
  );
}

const STEP_ICONS = [FormIcon, ChatIcon];

interface HeroProps {
  // true quando existe a seção #depoimentos (vídeos ou textos reais)
  hasTestimonials: boolean;
}

export function Hero({ hasTestimonials }: HeroProps) {
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">{renderAccentText(HERO.title)}</h1>
          <p className="hero-subtitle">{renderAccentText(HERO.subtitle)}</p>
        </div>

        <div className="hero-actions">
          <a className="btn btn-dark btn-hero-primary" href="#formulario">
            {HERO.primaryCta} <span className="btn-arrow" aria-hidden="true">↓</span>
          </a>
          {hasTestimonials ? (
            <a className="btn btn-outline" href="#depoimentos">
              {HERO.resultsCta}
            </a>
          ) : (
            <a className="btn btn-outline" href="#metodo">
              {HERO.methodCta}
            </a>
          )}
        </div>

        <div className="hero-side" id="formulario">
          <LeadForm />
          <ol className="hero-steps">
            {HERO.steps.map((text, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <li key={text}>
                  <span className="hero-step-icon">
                    <Icon />
                  </span>
                  {text}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
