import ProductCard from "./ProductCard";
import Section from "./Section";

const ProductGrid = ({ campaign }) => {
  const campaignHandle = campaign?.handle;
  const products = campaign?.resourceIds;

  return (
    <Section>
      <div className="grid grid-cols-4 items-center justify-center gap-8 w-full">
        {products?.map((productURL) => {
          const productId = productURL.split("/").pop();
          return <ProductCard {...{ productURL }} key={productId} />;
        })}
      </div>
    </Section>
  );
};

export default ProductGrid;
