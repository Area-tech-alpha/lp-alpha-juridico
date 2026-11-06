import type { ReactNode } from "react";

// Converte "texto *destaque* texto" em nós React, envolvendo os trechos
// entre asteriscos em <span className="accent-word"> (ver .accent-word em
// app/globals.css). Uso: NEXT_PUBLIC_BRAND_HEADLINE="Gaste *1 real* por lead".
export function renderAccentText(text: string): ReactNode[] {
  return text.split(/\*(.+?)\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="accent-word">
        {part}
      </span>
    ) : (
      part
    )
  );
}
