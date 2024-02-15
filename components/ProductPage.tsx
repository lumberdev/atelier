import React, { useState, FC } from "react";
import { currencyFormatter } from "@/lib/helper/currency";
import { storeThemes } from "@prisma/client";
import { pickTextColorBasedOnBgColorAdvanced } from "@/lib/helper/colors";
import { useTheme } from "@/lib/hooks/store/useTheme";
import PrimaryButton from "@/components/PrimaryButton";
import getProductDetails from "@/lib/campaign/getProductDetails";
import { useCart } from "@/context/CartProvider";

const ProductPage: FC<{
  product: Awaited<ReturnType<typeof getProductDetails>>;
}> = ({ product }) => {
  const { addToCart } = useCart();
  const [addToCartBtnEnabled, setAddToCartBtnEnabled] = useState(true);

  const {
    global: { backgroundColor },
  } = useTheme() as { global: storeThemes };
  const productTextColor = backgroundColor
    ? pickTextColorBasedOnBgColorAdvanced(backgroundColor, "white", "black")
    : "";

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
    <div className="container mx-auto p-6">
      <div className="xs:gap-16 relative grid grid-cols-1 gap-0 md:grid-cols-2">
        <div className="">
          {product.images.nodes.map((image, index) => (
            <img
              src={image.url}
              alt="Product Image"
              className="mb-4 w-full"
              key={index}
            />
          ))}
        </div>
        <div className="sticky top-20 h-fit">
          <h1
            className="mb-4 text-2xl font-semibold"
            style={{ color: productTextColor }}
          >
            {product.title}
          </h1>
          <p className="text-l mb-4" style={{ color: productTextColor }}>
            {product.description}
          </p>
          <p className="mb-2 text-lg" style={{ color: productTextColor }}>
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
