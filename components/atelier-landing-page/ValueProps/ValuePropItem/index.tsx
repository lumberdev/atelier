import React from "react";
import DropDownIcon from "@/assets/icons/dropdown-icon.svg";
import ArrowRightIcon from "@/components/atelier-landing-page/general/ArrowRightIcon";
import Link from "next/link";

interface ValuePropItemProps {
  title: string;
  subtitle: string;
}

const ValuePropItem = ({ title, subtitle }: ValuePropItemProps) => {
  const [showGetStarted, setShowGetStarted] = React.useState(false);
  return (
    <Link href="https://apps.shopify.com" target="_blank">
      <div
        className="transition-background flex w-full cursor-pointer items-center border-b border-b-brand-1 bg-brand-2 p-10 hover:bg-brand-3 md:px-[4rem] md:py-[3rem] lg:px-[5rem] lg:py-[3.65rem]"
        onMouseEnter={() => setShowGetStarted(true)}
        onMouseLeave={() => setShowGetStarted(false)}
      >
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="md:max-w-[28rem] lg:max-w-[43.75rem]">
            <h3 className="mb-[0.625rem] font-brand-heading text-2xl font-medium md:text-[1.75rem]">
              {title}
            </h3>
            <p className=" font-brand-body text-[1.125rem]">{subtitle}</p>
          </div>
          {/* Desktop */}
          <div className="hidden w-[11rem] items-center justify-end md:flex">
            {showGetStarted ? (
              <div className="flex items-center gap-4 lg:gap-9 ">
                <p className="font-brand-heading text-lg font-medium">
                  GET STARTED
                </p>
                <ArrowRightIcon color="#2F2F2E" />
              </div>
            ) : (
              <DropDownIcon width={42} height={43} />
            )}
          </div>
          {/* Mobile */}
          <div className="mt-4 flex items-center gap-4 md:hidden">
            <p className="font-brand-heading text-lg font-medium">
              GET STARTED
            </p>
            <ArrowRightIcon color="#2F2F2E" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ValuePropItem;
