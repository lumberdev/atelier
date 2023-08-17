import { currencyFormatter } from "@/lib/helper/currency";
import { useProductOnStore } from "@/lib/hooks/useProductOnStore";
import Spinner from "./Spinner";

const ProductPage = ({ campaign, product_id }) => {
  const { isLoading, product } = useProductOnStore({
    store_id: campaign.storeId,
    product_id: product_id,
  });
  console.log(product);
  return !isLoading ? (
    <div className="container mx-auto p-8">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="">
          {product.images.map((image) => (
            <img src={image.url} alt="Product Image" className="w-full mb-4" />
          ))}
        </div>
        <div className="sticky top-20 h-fit">
          <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
          <p className="text-l mb-4">{product.description}</p>
          <p className="text-lg mb-2">
            <span className="line-through mr-1">
              {currencyFormatter(product.priceRangeV2.maxVariantPrice)}
            </span>
            <span className="font-semibold">
              {currencyFormatter(product.priceRangeV2.minVariantPrice)}
            </span>
          </p>
          <form className="mb-4 flex flex-col w-48">
            {product.options.map((option) => (
              <>
                <label for={option.name} className="block mb-2">
                  {option.name}:
                </label>
                <select
                  name={option.name}
                  id={option.name}
                  className="border rounded p-2 "
                >
                  {option.values.map((value) => (
                    <option value={value}>{value}</option>
                  ))}
                </select>
              </>
            ))}
            <button
              type="submit"
              className="bg-[#555555] uppercase text-white py-2 px-4 rounded mt-4 cursor-pointer"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center">
      <Spinner />
    </div>
  );
};

export default ProductPage;
