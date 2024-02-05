import React from "react";
import BannerText from "./BannerText";

const VerticalScrollingBanner = () => (
  <div className="h-screen overflow-hidden">
    <div className="vertical-marquee-content flex flex-col gap-[1.875rem]">
      <BannerText />
      <BannerText />
      <BannerText />
    </div>
  </div>
);

export default VerticalScrollingBanner;
