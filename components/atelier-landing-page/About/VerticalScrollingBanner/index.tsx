import React from "react";
import BannerText from "./BannerText";

const VerticalScrollingBanner = ({ items }) => (
  <div className="h-[25rem] overflow-hidden md:h-screen">
    <div className="vertical-marquee-content flex flex-col gap-[1.875rem]">
      <BannerText items={items}/>
      <BannerText items={items}/>
      <BannerText items={items}/>
      <BannerText items={items}/>
      <BannerText items={items}/>
    </div>
  </div>
);

export default VerticalScrollingBanner;
