import ProductCard from "./ProductCard";
import Section from "./Section";
import { useProductsOnStore } from "@/lib/hooks/useProductsOnStore";

const ProductGrid = ({ campaign }) => {
  const productIDs = campaign?.resourceIds;
  const allProducts = useProductsOnStore({
    store_id: campaign.storeId,
  }).products;
  const products = allProducts.filter((product) =>
    productIDs.includes(product.id)
  );
  console.log(allProducts);
  return (
    <Section>
      <div className="grid grid-cols-4 items-center justify-center gap-8 w-full">
        {products && products.length > 0 ? (
          products.map((product) => {
            return <ProductCard {...{ product }} key={product.id} />;
          })
        ) : (
          <div>loading products</div>
        )}
      </div>
    </Section>
  );
};

export default ProductGrid;
