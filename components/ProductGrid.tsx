import ProductCard from "./ProductCard";
import Section from "./Section";
const ProductGrid = ({ products, campaign_handle }) => {
  return (
    <Section>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-8 w-full mx-16">
        {products.map((product) => {
          return (
            <ProductCard {...{ product, campaign_handle }} key={product.id} />
          );
        })}
      </div>
    </Section>
  );
};

export default ProductGrid;
