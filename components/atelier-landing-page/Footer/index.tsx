import Link from "next/link";
import Image from "next/image";
import LumberLogo from "@/assets/logos/lumber-logo.svg";
const Footer = () => {
  return (
    <footer className="w-full bg-[#212120] py-10 text-white">
      <div className="mx-0 flex flex-col items-center justify-center gap-[1rem] px-10 md:flex-row md:justify-between">
        <Link href="https://lumber.dev/" target="_blank" rel="noreferrer">
          <div className="flex items-center gap-3">
            Made by
            <LumberLogo />
          </div>
        </Link>
        <div className="mb-4 block text-xs md:hidden">
          © Lumber LLC. All rights reserved
        </div>
        <div className="flex items-center justify-end">
          <div className="mr-[3rem] hidden text-sm md:mr-[5rem] md:block">
            © Lumber LLC. All rights reserved
          </div>
          <div className="flex justify-end gap-[1rem] text-xs underline md:gap-[3rem] md:text-sm">
            <Link href="/pages/privacy">Privacy</Link>
            <Link href="/pages/faq">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
