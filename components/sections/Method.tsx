import { METHOD } from "@/lib/landing";
import { renderAccentText } from "@/lib/text";

export function Method() {
  return (
    <section className="section" id="metodo">
      <div className="container">
        <div className="method-head">
          <h2 className="method-title">{renderAccentText(METHOD.title)}</h2>
          <p className="method-subtitle">{METHOD.subtitle}</p>
        </div>
        <ol className="method-grid">
          {METHOD.steps.map((step) => (
            <li className="method-card" key={step.number}>
              <div className="method-card-top">
                <span className="method-letter" aria-hidden="true">
                  {step.letter}
                </span>
                <span className="method-number" aria-hidden="true">
                  {step.number}
                </span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
