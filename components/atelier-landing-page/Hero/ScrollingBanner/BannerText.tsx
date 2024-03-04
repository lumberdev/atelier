import AsteriskSign from "@/assets/icons/asterisk-sign.svg";
import AsteriskSignSmall from "@/assets/icons/asterisk-sign-small.svg";

const BannerText = () => {
  console.log(AsteriskSign);
  return (
    <div className="flex items-center justify-center gap-[3.125rem] pr-[3.125rem] text-[3rem] text-brand-1 md:text-[3.75rem] lg:text-[4.375rem] ">
      <p className="font-brand-body italic">private sales</p>
      <p className="font-brand-heading font-light">for shopify stores</p>
      <AsteriskSign className="hidden md:block" />
      <AsteriskSignSmall className="block md:hidden" />
    </div>
  );
};

export default BannerText;
