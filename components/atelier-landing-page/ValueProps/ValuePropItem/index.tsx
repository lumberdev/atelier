import React from "react";
import DropDownIcon from "@/assets/icons/dropdown-icon.svg";
import ArrowRightIcon from "@/components/atelier-landing-page/general/ArrowRightIcon";

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
          <h3 className="mb-[0.625rem] font-brand-heading text-[1.75rem] font-medium">
            {title}
          </h3>
          <p className="max-w-[43.75rem] font-brand-body text-[1.125rem]">
            {description}
          </p>
        </div>
        <div>
          {showGetStarted ? (
            <div className="flex gap-9">
              <p className="font-brand-heading text-[1.125rem] font-medium">
                GET STARTED
              </p>
              <ArrowRightIcon color="#2F2F2E" />
            </div>
          ) : (
            <DropDownIcon width={42} height={43} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ValuePropItem;
