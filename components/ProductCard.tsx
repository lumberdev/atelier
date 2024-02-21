import { getTextColor } from "@/lib/helper/colors";
import { currencyFormatter } from "@/lib/helper/currency";
import Link from "next/link";
import { FC } from "react";
import getProductListing from "@/lib/campaign/getProductListing";
import { useTheme } from "@/context/ThemeProvider";

const ProductCard: FC<{
  product: Awaited<
    ReturnType<typeof getProductListing>
  >["products"]["nodes"][0];
  handle: string;
}> = ({ product, handle }) => {
  const { global } = useTheme();

  const { maxVariantPrice } = product.priceRangeV2;

  const href = `/${handle}/${product.handle}`;
  const amount = Number(maxVariantPrice.amount);
  const textColor = getTextColor(global.backgroundColor);

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden">
      <Link href={href} className="flex aspect-square h-fit w-full	">
        <img
          className="h-full w-full max-w-full object-cover"
          src={product.featuredImage?.url}
        />
      </Link>

      <div className="flex w-full flex-col pt-2 text-3xl sm:text-2xl md:text-xl">
        <Link href={href} className="no-underline">
          <h3
            className="overflow-hidden truncate text-base font-bold sm:text-xl"
            style={{ color: textColor }}
          >
            {product.title}
          </h3>
        </Link>

        <div className="flex flex-row pt-1">
          <p
            className="text-base font-bold sm:text-xl"
            style={{ color: textColor }}
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
