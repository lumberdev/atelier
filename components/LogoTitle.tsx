import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabaseStorage } from "@/utils/supabase";
import { useTheme } from "@/context/ThemeProvider";

const LogoTitle = ({ title, handle, color = "black", className = "" }) => {
  const {
    global: { logo },
  } = useTheme();

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (!logo) return;
    const image = supabaseStorage.getPublicUrl(logo);
    setImageUrl(image?.data.publicUrl ?? "");
  }, [logo]);

  return (
    <Link
      href={`/${handle}`}
      className={`flex items-center no-underline ${className}`}
    >
      {imageUrl !== "" ? (
        <Image
          width={100}
          height={100}
          src={imageUrl}
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
