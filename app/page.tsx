// Página da landing — IDÊNTICA nas 3 LPs. O texto vem de lib/landing.ts.
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Method } from "@/components/sections/Method";
import { ServicesTicker } from "@/components/sections/ServicesTicker";
import { Testimonials } from "@/components/sections/Testimonials";
import { TopTicker } from "@/components/sections/TopTicker";
import { TESTIMONIALS } from "@/lib/testimonials";
import { VIDEO_TESTIMONIALS } from "@/lib/videoTestimonials";

export default function Home() {
  const hasTestimonials = VIDEO_TESTIMONIALS.length > 0 || TESTIMONIALS.length > 0;

  return (
    <>
      <TopTicker />
      <Header />
      <main>
        <Hero hasTestimonials={hasTestimonials} />
        <ServicesTicker />
        {hasTestimonials ? <Testimonials /> : null}
        <About />
        <Method />
        <Faq />
      </main>
      <Footer hasTestimonials={hasTestimonials} />
    </>
  );
}
