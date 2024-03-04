import React from "react";
import VerticalScrollingBanner from "./VerticalScrollingBanner";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { PageAbout } from "@/tina/__generated__/types";

export interface AboutProps {
  data: PageAbout;
}

const About = ({ data }: AboutProps) => {
  return (
    <div className="flex w-full flex-col bg-brand-1 md:h-screen md:flex-row">
      <div className="flex items-center justify-center px-10 pb-16 pt-20 text-brand-2 md:w-1/2 md:px-20 md:py-0">
        <div className="flex max-w-[37.6rem] flex-col gap-5 ">
          <h3 className="self-start font-brand-heading text-sm font-medium uppercase md:text-lg">
            {data.title}
          </h3>
          <div className="flex flex-col gap-[1.875rem] font-brand-body text-2xl lg:text-[1.75rem] [&>*]:font-light">
            <TinaMarkdown content={data.body} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center overflow-hidden px-5 md:w-1/2 md:px-0">
        <VerticalScrollingBanner items={data.useCases} />
      </div>
    </div>
  );
};

export default About;
