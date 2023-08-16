import { useProductOnStore } from "@/lib/hooks/useProductOnStore";

const ProductPage = ({ campaign, product_id }) => {
  const product = useProductOnStore({
    store_id: campaign.storeId,
    product_id: product_id,
  });

  return (
    <div className="container mx-auto p-8">
      <div>{JSON.stringify(product)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="sticky top-20">
          <img
            src="product-image.jpg"
            alt="Product Image"
            className="w-full mb-4"
          />
          <img
            src="product-image2.jpg"
            alt="Product Image 2"
            className="w-full mb-4"
          />
          <img
            src="product-image3.jpg"
            alt="Product Image 3"
            className="w-full"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-4">Product Title</h1>
          <p className="text-gray-600 mb-4">Product description goes here.</p>
          <p className="text-lg font-semibold mb-2">$XX.XX</p>
          <form className="mb-4">
            <label for="size" className="block mb-2">
              Size:
            </label>
            <select name="size" id="size" className="border rounded p-2 w-full">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
              Add to Cart
            </button>
          </form>
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">
              Additional Information
            </h2>
            <p className="text-gray-600">
              Product specifications and other info can be placed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
