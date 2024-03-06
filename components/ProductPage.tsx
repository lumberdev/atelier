import React, { useState, FC, CSSProperties } from "react";
import { currencyFormatter } from "@/lib/helper/currency";
import { getTextColor } from "@/lib/helper/colors";
import PrimaryButton from "@/components/PrimaryButton";
import getProductDetails from "@/lib/campaign/getProductDetails";
import { useCart } from "@/context/CartProvider";
import { useTheme } from "@/context/ThemeProvider";

const ProductPage: FC<{
  product: Awaited<ReturnType<typeof getProductDetails>>;
}> = ({ product }) => {
  const { addToCart } = useCart();
  const [addToCartBtnEnabled, setAddToCartBtnEnabled] = useState(true);

  const {
    global: { backgroundColor },
  } = useTheme();

  const formChange = (e) => {
    const form = e.target.form;
    const values = Array.from(form).reduce((acc, input) => {
      if (input instanceof HTMLSelectElement) {
        acc[input.name] = input.value;
      }
      return acc;
    }, {});
    const variant = product.variants.nodes.find((variant) => {
      return variant.selectedOptions.every((selectedOption) => {
        return selectedOption.value === values[selectedOption.name];
      });
    });
    form.setAttribute("value-variant-id", variant.id);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("productForm");
    const variantId = form.getAttribute("value-variant-id");
    const quantity = parseInt(form.getAttribute("value-quantity"));
    const variant = product.variants.nodes.find(
      (variant) => variant.id === variantId
    );

    const item = {
      title: product.title,
      id: variant.id,
      price: variant.price,
      selectedOptions: variant.selectedOptions,
      image:
        product.hasOnlyDefaultVariant || !variant.image
          ? product.images.nodes[0]
          : variant.image,
      inventoryQuantity: variant.inventoryQuantity,
      quantity: quantity,
    };

    addToCart({ variantId: variant.id, quantity: 1 });
  };

  return (
    <div className="container mx-auto p-8">
      <div className="xs:gap-16 relative grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="px-8">
          {product.images.nodes.map((image, index) => (
            <img
              src={image.url}
              alt="Product Image"
              className="mb-4 w-full"
              key={index}
            />
          ))}
        </div>
        <div
          className="sticky top-40 h-fit px-8"
          style={
            {
              "--atelier-text-color": getTextColor(backgroundColor),
            } as CSSProperties
          }
        >
          <h1 className="text-atelier-text mb-4 text-2xl font-semibold">
            {product.title}
          </h1>
          <p className="text-l text-atelier-text mb-4">{product.description}</p>
          <p className="text-atelier-text mb-2 text-lg">
            <span className="mr-1 line-through">
              {currencyFormatter(product.priceRangeV2.maxVariantPrice)}
            </span>
            <span className="font-semibold">
              {currencyFormatter(product.priceRangeV2.minVariantPrice)}
            </span>
          </p>

          <form
            id="productForm"
            value-variant-id={product.variants.nodes[0].id}
            value-quantity={1}
            className="mb-4 flex w-48 flex-col"
            onChange={formChange}
          >
            {product.options.map((option, index) =>
              option.name !== "Title" ? (
                <React.Fragment key={index}>
                  <label
                    htmlFor={option.name}
                    className="mb-2 block"
                    key={`label${index}`}
                  >
                    {option.name}:
                  </label>
                  <select
                    name={option.name}
                    id={option.name}
                    className="rounded border p-2 "
                    key={`select${index}`}
                  >
                    {option.values.map((value, index) => (
                      <option value={value} key={index}>
                        {value}
                      </option>
                    ))}
                  </select>
                </React.Fragment>
              ) : null
            )}
            <PrimaryButton type="submit" onClick={onSubmit}>
              {addToCartBtnEnabled ? "Add to Cart" : "Out of Stock"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
