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
      {/* Switching to img tag, Next/Image caching and showing stale images since image url stays the same when logo is updated */}
      <img
        src={`${logo}?version=${Date.now()}`}
        alt={title}
        width="auto"
        height={48}
        className="mx-auto h-[3rem] w-auto py-2 lg:mx-0"
      />
    </Link>
  );
};

export default LogoTitle;
