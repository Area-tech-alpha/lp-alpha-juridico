import { SERVICES_TICKER } from "@/lib/landing";
import { Marquee } from "./Marquee";

export function ServicesTicker() {
  return (
    <div className="services-ticker">
      <div className="services-band">
        <Marquee items={SERVICES_TICKER} repeat={3} label="Serviços da Alpha" />
      </div>
    </div>
  );
}
