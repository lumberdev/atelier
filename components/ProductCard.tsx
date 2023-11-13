import { useTheme } from "@/lib/hooks/useTheme";
import { storeThemes } from "@prisma/client";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";
import { currencyFormatter } from "@/lib/helper/currency";
import Link from "next/link";

const ProductCard = ({ product, handle }) => {
  const { minVariantPrice, maxVariantPrice } = product.priceRangeV2;

  const {
    global: { backgroundColor },
  } = useTheme() as { global: storeThemes };
  const cardTextColor = backgroundColor
    ? pickTextColorBasedOnBgColorAdvanced(backgroundColor, "white", "black")
    : "";

  return (
    <div className="mx-auto w-fit w-full max-w-full overflow-hidden">
      <Link
        href={`/campaign/${handle}/products/${
          product.id.split("gid://shopify/Product/")[1]
        }`}
        className="flex aspect-square h-fit w-full	"
      >
        <img
          className="h-48 h-full w-48 w-full max-w-full object-cover"
          src={product.featuredImage?.url}
        />
      </Link>
      <div className="flex w-full flex-col pt-2 text-3xl sm:text-2xl md:text-xl">
        <Link
          href={`/campaign/${handle}/products/${
            product.id.split("gid://shopify/Product/")[1]
          }`}
          className="no-underline"
        >
          <h3
            className="overflow-hidden truncate text-base font-bold text-black sm:text-xl"
            style={{ color: cardTextColor }}
          >
            {product.title}
          </h3>
        </Link>
        <div className="flex flex-row pt-1">
          <h3
            className="mr-1	text-base line-through sm:text-xl"
            style={{ color: cardTextColor }}
          >
            {currencyFormatter(maxVariantPrice)}
          </h3>
          <h3
            className="text-base font-bold sm:text-xl"
            style={{ color: cardTextColor }}
          >
            {currencyFormatter(minVariantPrice)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
