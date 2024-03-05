import AsteriskSign from "@/assets/icons/asterisk-sign.svg";
import AsteriskSignSmall from "@/assets/icons/asterisk-sign-small.svg";
import { PageHero } from "@/tina/__generated__/types";

interface BannerTextProps {
  data: PageHero;
}
const BannerText = ({ data }: BannerTextProps) => {
  return (
    <div className="flex items-center justify-center gap-[3.125rem] pr-[3.125rem] text-[3rem] text-brand-1 md:text-[3.75rem] lg:text-[4.375rem] ">
      <p className="font-brand-body italic">{data.marquee_text_1}</p>
      <p className="font-brand-heading font-light">{data.marquee_text_2}</p>
      <AsteriskSign className="hidden md:block" />
      <AsteriskSignSmall className="block md:hidden" />
    </div>
  );
};

export default BannerText;
