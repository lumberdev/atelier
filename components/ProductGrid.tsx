import ProductCard from "./ProductCard";
import Section from "./Section";
const ProductGrid = ({ products, handle }) => {
  return (
    <Section>
      <div className="mx-4 grid w-full grid-cols-2 items-center justify-center gap-4 pt-6 xs:gap-8 sm:grid-cols-3 lg:mx-16 lg:grid-cols-4 lg:pt-2 xl:grid-cols-5">
        {products.map((product) => {
          return <ProductCard {...{ product, handle }} key={product.id} />;
        })}
      </div>
    </Section>
  );
};

export default ProductGrid;
