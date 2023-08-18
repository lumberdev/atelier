import ProductCard from "./ProductCard";
import Section from "./Section";
import { useProductsOnStore } from "@/lib/hooks/useProductsOnStore";
import Spinner from "@/components/Spinner";

const ProductGrid = ({ campaign, campaign_handle }) => {
  const productIDs = campaign?.resourceIds;
  const allProducts = useProductsOnStore({
    store_id: campaign.storeId,
  }).products;
  const products = allProducts.filter((product) =>
    productIDs.includes(product.id)
  );

  return (
    <Section>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 items-center justify-center gap-8 w-full">
        {products && products.length > 0 ? (
          products.map((product) => {
            return (
              <ProductCard {...{ product, campaign_handle }} key={product.id} />
            );
          })
        ) : (
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 flex flex-col items-center justify-center">
            Loading products
            <br />
            <br />
            <Spinner />
          </div>
        )}
      </div>
    </Section>
  );
};

export default ProductGrid;
