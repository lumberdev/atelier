import AsteriskSign from "@/assets/icons/asterisk-sign.svg";

const BannerText = () => {
  return (
    <div className="flex items-center justify-center gap-[3.125rem] pr-[3.125rem] text-[4.375rem] text-brand-1 ">
      <p className="font-brand-body italic">private sales</p>
      <p className="font-brand-heading font-light">for shopify stores</p>
      <AsteriskSign width={62} height={62} />
    </div>
  );
};

export default BannerText;
