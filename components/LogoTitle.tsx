import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoTitleProps {
  title: string;
  handle: string;
  logo: string;
  className?: string;
}

const LogoTitle: React.FC<LogoTitleProps> = ({
  title,
  handle,
  logo,
  className = "",
}) => {
  return (
    <Link
      href={`/${handle}`}
      className={`flex items-center no-underline ${className}`}
    >
      <Image
        width={100}
        height={100}
        src={logo}
        alt={title}
        className="mx-auto h-[3rem] w-auto py-2 lg:mx-0"
      />
    </Link>
  );
};

export default LogoTitle;
