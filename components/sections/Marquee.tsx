// Marquee em CSS puro (ver .marquee em app/globals.css). Renderiza duas
// trilhas iguais lado a lado; a segunda é decorativa (aria-hidden).
interface MarqueeProps {
  items: string[];
  // Quantas vezes a lista se repete em cada trilha (garante largura > tela).
  repeat?: number;
  separator?: string;
  label: string;
}

export function Marquee({ items, repeat = 4, separator = "•", label }: MarqueeProps) {
  const sequence = Array.from({ length: repeat }, () => items).flat();

  const track = (hidden: boolean) => (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {sequence.map((item, i) => (
        <li key={i}>
          <span>{item}</span>
          <span className="marquee-sep" aria-hidden="true">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" role="marquee" aria-label={label}>
      {track(false)}
      {track(true)}
    </div>
  );
}
