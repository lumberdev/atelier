import ProductCard from "./ProductCard";
import Section from "./Section";
import { useProducts } from "@/lib/hooks/useProducts";

const ProductGrid = ({ campaign }) => {
  const campaignHandle = campaign?.handle;
  const productIDs = campaign?.resourceIds;
  const allProducts = useProducts().products;
  const products = allProducts.filter((product) =>
    productIDs.includes(product.id)
  );

  return (
    <Section>
      <div className="grid grid-cols-4 items-center justify-center gap-8 w-full">
        {products?.map((product) => {
          return <ProductCard {...{ product }} key={product.id} />;
        })}
      </div>
    </Section>
  );
};

export default ProductGrid;
