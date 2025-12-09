import { infos } from "@/config/landing";
import BentoGrid from "@/components/shared/sections/bentogrid";
import Features from "@/components/shared/sections/features";
import HeroLanding from "@/components/shared/sections/hero-landing";
import InfoLanding from "@/components/shared/sections/info-landing";
import Powered from "@/components/shared/sections/powered";
import PreviewLanding from "@/components/shared/sections/preview-landing";
import Testimonials from "@/components/shared/sections/testimonials";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}
