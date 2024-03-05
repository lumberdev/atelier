import React from "react";
import Image from "next/image";
import ScrollingBanner from "@/components/atelier-landing-page/Hero/ScrollingBanner";
import { PageHero } from "@/tina/__generated__/types";

interface HeroProps {
  data: PageHero;
}

const Hero = ({ data }: HeroProps) => {
  return (
    <div className="h-screen w-full bg-brand-3">
      <div className="relative h-full w-full bg-brand-3">
        <Image
          className="hidden h-full w-full object-contain md:block"
          src={data?.hero_image_desktop}
          alt="Atelier"
          fill={true}
        />
        <Image
          className="h-full w-full object-contain md:hidden"
          src={data?.hero_image_mobile}
          alt="Atelier"
          fill={true}
        />
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden">
          <ScrollingBanner data={data} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
