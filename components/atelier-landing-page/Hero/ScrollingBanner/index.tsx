import React from "react";
import Marquee from "react-fast-marquee";
import BannerText from "./BannerText";

const ScrollingBanner = () => (
  <Marquee>
    <div className="border-brand-1 flex border-y-2 backdrop-blur-md overflow-y-hidden">
      <BannerText />
      <BannerText />
      <BannerText />
      <BannerText />
    </div>
  </Marquee>
);

export default ScrollingBanner;
