import React from "react";
import BannerText from "./BannerText";

const VerticalScrollingBanner = () => (
  <div className="h-[25rem] md:h-screen overflow-hidden">
    <div className="vertical-marquee-content flex flex-col gap-[1.875rem]">
      <BannerText />
      <BannerText />
      <BannerText />
      <BannerText />
      <BannerText />
    </div>
  </div>
);

export default VerticalScrollingBanner;
