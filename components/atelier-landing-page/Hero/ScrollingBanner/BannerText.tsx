import AsteriskSign from "@/assets/asterisk-sign.svg";
import Image from "next/image";

const BannerText = () => {
  return (
    <div className="flex items-center justify-center gap-[3.125rem] pr-[3.125rem] text-[4.375rem] text-brand-1 ">
      <p className="font-brand-body italic">private sales</p>
      <p className="font-brand-heading font-light">
        for shopify stores
      </p>
      <Image src={AsteriskSign} alt="Asterisk sign" width="62" height="62" />
    </div>
  );
};

export default BannerText;
