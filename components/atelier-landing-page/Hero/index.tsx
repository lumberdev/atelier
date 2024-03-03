import React from "react";
import AtelierHero from "@/assets/atelier-hero.png";
import Image from "next/image";
import ScrollingBanner from "@/components/atelier-landing-page/Hero/ScrollingBanner";

const Hero = () => {
  return (
    <div className="h-screen w-full bg-brand-3">
      <div className="relative h-full w-full bg-brand-3">
        <Image
          className="h-full w-full object-contain"
          src={AtelierHero}
          alt="Atelier"
        />
        <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 overflow-hidden">
          <ScrollingBanner />
        </div>
      </div>
    </div>
  );
};

export default Hero;
