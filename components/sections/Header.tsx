import { LOGO } from "@/lib/landing";

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <a className="site-logo" href="#inicio" aria-label={`${LOGO.alt} — início`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO.src} alt={LOGO.alt} width={LOGO.width} height={LOGO.height} />
        </a>
      </div>
    </header>
  );
}
