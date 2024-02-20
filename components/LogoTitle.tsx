import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeProvider";

const LogoTitle = ({ title, handle, color = "black", className = "" }) => {
  const {
    global: { logo },
  } = useTheme();

  return (
    <Link
      href={`/${handle}`}
      className={`flex items-center no-underline ${className}`}
    >
      {logo ? (
        <Image
          width={100}
          height={100}
          src={logo}
          alt={title}
          className="mx-auto h-[3rem] w-auto py-2 lg:mx-0"
        />
      ) : (
        <h1
          className="mx-1 py-0 text-xl text-black lg:py-4 lg:text-3xl"
          style={{ color: color }}
        >
          {title}
        </h1>
      )}
    </Link>
  );
};

export default LogoTitle;
