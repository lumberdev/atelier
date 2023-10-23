import { currencyFormatter } from "@/lib/helper/currency";
import Link from "next/link";

const ProductCard = ({ product, handle }) => {
  const { minVariantPrice, maxVariantPrice } = product.priceRangeV2;

  return (
    <div className="overflow-hidden w-fit mx-auto bg-white max-w-full w-full">
      <Link
        href={`/campaign/${handle}/products/${
          product.id.split("gid://shopify/Product/")[1]
        }`}
        className="flex h-fit w-full aspect-square	"
      >
        <img
          className="w-48 h-48 object-cover max-w-full w-full h-full"
          src={product.featuredImage?.url}
        />
      </Link>
      <div className="flex flex-col w-full pt-2 text-3xl sm:text-2xl md:text-xl">
        <Link
          href={`/campaign/${handle}/products/${
            product.id.split("gid://shopify/Product/")[1]
          }`}
          className="no-underline"
        >
          <h3 className="text-black truncate overflow-hidden font-bold text-base sm:text-xl">
            {product.title}
          </h3>
        </Link>
        <div className="flex flex-row pt-1">
          <h3 className="line-through	mr-1 text-base sm:text-xl	">
            {currencyFormatter(maxVariantPrice)}
          </h3>
          <h3 className="font-bold text-base sm:text-xl">
            {currencyFormatter(minVariantPrice)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
