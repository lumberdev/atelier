import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/hooks/store/useTheme";
import { storeThemes } from "@prisma/client";
import Image from "next/image";
import { supabaseStorage } from "@/utils/supabase";

const LogoTitle = ({
  campaign,
  campaignHandle,
  color = "black",
  className = "",
}) => {
  const {
    global: { logo },
  } = useTheme() as { global: storeThemes };

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (!logo) return;
    const image = supabaseStorage.getPublicUrl(logo);
    setImageUrl(image?.data.publicUrl ?? "");
  }, [logo]);

  return (
    <Link
      href={`/campaign/${campaignHandle}`}
      className={`flex items-center no-underline ${className}`}
    >
      {imageUrl !== "" ? (
        <Image
          width={64}
          height={64}
          src={imageUrl}
          alt={campaign?.title}
          className="mx-auto h-[3rem] w-auto lg:mx-0"
        />
      ) : (
        <h1
          className="mx-1 py-0 text-xl text-black lg:py-4 lg:text-3xl"
          style={{ color: color }}
        >
          {campaign?.title}
        </h1>
      )}
    </Link>
  );
};

export default LogoTitle;
