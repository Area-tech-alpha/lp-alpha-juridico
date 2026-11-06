import { TOP_TICKER } from "@/lib/landing";
import { Marquee } from "./Marquee";

export function TopTicker() {
  return (
    <div className="top-ticker">
      <Marquee items={[TOP_TICKER]} repeat={6} separator="✦" label={TOP_TICKER} />
    </div>
  );
}
