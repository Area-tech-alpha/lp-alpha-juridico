import { FAQ } from "@/lib/landing";
import { renderAccentText } from "@/lib/text";

export function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container faq-grid">
        <div className="faq-aside">
          <p className="section-label">FAQ</p>
          <h2 className="section-title">{renderAccentText(FAQ.title)}</h2>
        </div>
        <div className="faq-list">
          {FAQ.items.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>
                {item.question}
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
