import AsteriskSign from "@/assets/asterisk-sign.svg";
import Image from "next/image";

const BannerText = () => {
  return (
    <div className="text-brand-1 flex items-center justify-center gap-[5rem] pr-[5rem] text-[7rem]">
      <p className=" first-letter:italic">private sales</p>
      <p className="">for shopify stores</p>
      <Image src={AsteriskSign} alt="Asterisk sign" width="62" height="62" />
    </div>
  );
};

export default BannerText;
