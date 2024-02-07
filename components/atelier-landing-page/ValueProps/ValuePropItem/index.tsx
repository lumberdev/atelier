import React from "react";
import Image from "next/image";
import DropDownIcon from "@/assets/dropdown-icon.svg";
import ArrowRightIcon from "@/assets/arrow-right.svg";

interface ValuePropItemProps {
  title: string;
  description: string;
  url: string;
}

const ValuePropItem = ({ title, description, url }: ValuePropItemProps) => {
  const [showGetStarted, setShowGetStarted] = React.useState(false);
  return (
    <div
      className="flex w-full cursor-pointer items-center border-b border-b-brand-1 bg-brand-2 px-[5rem] py-[3.65rem] transition-background hover:bg-brand-3"
      onMouseEnter={() => setShowGetStarted(true)}
      onMouseLeave={() => setShowGetStarted(false)}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          <h3 className="font-brand-heading mb-[0.625rem] text-[1.75rem] font-medium">
            {title}
          </h3>
          <p className="font-brand-body max-w-[43.75rem] text-[1.125rem]">
            {description}
          </p>
        </div>
        <div>
          {showGetStarted ? (
            <div className="flex gap-9">
              <p className="font-brand-heading text-[1.125rem] font-medium">
                GET STARTED
              </p>
              <Image
                src={ArrowRightIcon}
                alt="GET STARTED"
                width="20"
                height="20"
              />
            </div>
          ) : (
            <Image
              src={DropDownIcon}
              alt="GET STARTED"
              width="40"
              height="40"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuePropItem;
