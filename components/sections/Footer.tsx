import { SOCIAL_INSTAGRAM_URL, SOCIAL_YOUTUBE_URL } from "@/lib/config";
import { FOOTER, LOGO } from "@/lib/landing";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12l-6.2 3.5Z" />
    </svg>
  );
}

interface FooterProps {
  hasTestimonials: boolean;
}

export function Footer({ hasTestimonials }: FooterProps) {
  const nav = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    ...(hasTestimonials ? [{ href: "#depoimentos", label: "Depoimentos" }] : []),
    { href: "#metodo", label: "Método" },
    { href: "#faq", label: "FAQ" },
  ];
  const social = [
    { href: SOCIAL_INSTAGRAM_URL, label: "Instagram", Icon: InstagramIcon },
    { href: SOCIAL_YOUTUBE_URL, label: "YouTube", Icon: YoutubeIcon },
  ].filter((item) => item.href);

  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-grid">
        <div className="footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} loading="lazy" />
          <p>{FOOTER.tagline}</p>
        </div>

        <nav className="footer-col" aria-label="Navegação">
          <h2>Navegação</h2>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {social.length > 0 ? (
          <div className="footer-col">
            <h2>Redes</h2>
            <ul>
              {social.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    <Icon />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Assessoria Alpha. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
