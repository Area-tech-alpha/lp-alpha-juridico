import { ABOUT } from "@/lib/landing";
import { renderAccentText } from "@/lib/text";

export function About() {
  const { image } = ABOUT;
  return (
    <section className="section" id="sobre">
      <div className={`container about-grid${image ? " has-image" : ""}`}>
        <div className="about-copy">
          <p className="section-label">{ABOUT.label}</p>
          <h2 className="section-title">{renderAccentText(ABOUT.title)}</h2>
          <div className="about-body">
            {ABOUT.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <a className="btn btn-brand" href="#formulario">
            {ABOUT.cta} <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
        </div>
        {image ? (
          <div className="about-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
