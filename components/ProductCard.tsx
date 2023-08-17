import { currencyFormatter } from "@/lib/helper/currency";
import Link from "next/link";

const ProductCard = ({ product, campaign_handle }) => {
  const { minVariantPrice, maxVariantPrice } = product.priceRangeV2;

  return (
    <div className="overflow-hidden w-fit mx-auto bg-white">
      <Link
        href={`/campaign/${campaign_handle}/products/${
          product.id.split("gid://shopify/Product/")[1]
        }`}
        className="flex h-fit "
      >
        <img
          className="w-48 h-48 object-cover max-w-full"
          src={product.featuredImage?.url}
        />
      </Link>
      <div className="flex flex-col w-48 py-2 text-base">
        <Link
          href={`/campaign/${campaign_handle}/products/${
            product.id.split("gid://shopify/Product/")[1]
          }`}
          className="no-underline"
        >
          <h3 className="text-black truncate overflow-hidden font-bold	">
            {product.title}
          </h3>
        </Link>
        <div className="flex flex-row pt-1">
          <h3 className="line-through	mr-1">
            {currencyFormatter(maxVariantPrice)}
          </h3>
          <h3 className="font-bold	">{currencyFormatter(minVariantPrice)}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
