const ProductCard = ({ product }) => {
  console.log(product);

  const currencyFormatter = ({ amount, currencyCode }) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);

  const { minVariantPrice, maxVariantPrice } = product.priceRangeV2;

  return (
    <div className="border border-solid border-black overflow-hidden w-fit mx-auto bg-white">
      <img
        className="w-48 h-48 object-cover max-w-full"
        src={product.featuredImage?.url}
      />
      <div className="flex flex-col w-48 p-3">
        <h3 className="truncate overflow-hidden">{product.title}</h3>
        <div className="flex flex-row">
          <h3 className="line-through	mr-1">
            {currencyFormatter(maxVariantPrice)}
          </h3>
          <h3>{currencyFormatter(minVariantPrice)}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
