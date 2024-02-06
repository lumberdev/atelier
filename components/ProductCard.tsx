import { useTheme } from "@/lib/hooks/store/useTheme";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";
import { currencyFormatter } from "@/lib/helper/currency";
import Link from "next/link";
import { FC } from "react";
import getProductListing from "@/lib/campaign/getProductListing";
import getIdFromGid from "@/utils/getIdFromGid";

const ProductCard: FC<{
  product: Awaited<
    ReturnType<typeof getProductListing>
  >["products"]["nodes"][0];
  handle: string;
}> = ({ product, handle }) => {
  const { global } = useTheme();

  const backgroundColor = global.backgroundColor ?? "";

  const { minVariantPrice, maxVariantPrice } = product.priceRangeV2;

  const cardTextColor = backgroundColor
    ? pickTextColorBasedOnBgColorAdvanced(backgroundColor, "white", "black")
    : "";

  const href = `/${handle}/products/${getIdFromGid(product.id)}`;
  const amount = Number(maxVariantPrice.amount);

  return (
    <div className="mx-auto w-fit w-full max-w-full overflow-hidden">
      <Link href={href} className="flex aspect-square h-fit w-full	">
        <img
          className="h-48 h-full w-48 w-full max-w-full object-cover"
          src={product.featuredImage?.url}
        />
      </Link>

      <div className="flex w-full flex-col pt-2 text-3xl sm:text-2xl md:text-xl">
        <Link href={href} className="no-underline">
          <h3
            className="overflow-hidden truncate text-base font-bold text-black sm:text-xl"
            style={{ color: cardTextColor }}
          >
            {product.title}
          </h3>
        </Link>

        <div className="flex flex-row pt-1">
          <p
            className="text-base font-bold sm:text-xl"
            style={{ color: cardTextColor }}
          >
            {currencyFormatter({
              amount,
              currencyCode: maxVariantPrice.currencyCode,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
