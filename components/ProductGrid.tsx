import { FC } from "react";
import ProductCard from "./ProductCard";
import Container from "./general/Container";
import getProductListing from "@/lib/campaign/getProductListing";

const ProductGrid: FC<{
  handle: string;
  products: Awaited<ReturnType<typeof getProductListing>>["products"]["nodes"];
}> = ({ products, handle }) => {
  return (
    <Container
      variant="lg"
      className="xs:gap-8 grid w-full grid-cols-2 items-center justify-center gap-4 pt-6 sm:grid-cols-3 lg:grid-cols-4 lg:pt-2 xl:grid-cols-5"
    >
      {products.map((product) => {
        return <ProductCard {...{ product, handle }} key={product.id} />;
      })}
    </Container>
  );
};

export default ProductGrid;
