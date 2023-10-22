import React, { use, useState, useEffect } from "react";
import { currencyFormatter } from "@/lib/helper/currency";
import { useCart } from "@/context/CartContext";
import CartTesting from "@/components/CartTesting";
import { useCheckoutOnStore } from "@/lib/hooks/useCheckoutOnStore";

const ProductPage = ({ product, campaign }) => {
  const { addItem, cartItems } = useCart();
  const [addToCartBtnEnabled, setAddToCartBtnEnabled] = useState(false);

  const checkQuantityIsInLimit = () => {
    const form = document.getElementById("productForm");
    const variant = product.variants.find(
      (variant) => variant.id === form.getAttribute("value-variant-id")
    );
    const cartItem = cartItems.find((item) => item.id === variant.id);
    const cartItemQuantity = cartItem ? cartItem.quantity : 0;
    setAddToCartBtnEnabled(variant.inventoryQuantity - cartItemQuantity > 0);
  };

  const formChange = (e) => {
    const form = e.target.form;
    const values = Array.from(form).reduce((acc, input) => {
      if (input instanceof HTMLSelectElement) {
        acc[input.name] = input.value;
      }
      return acc;
    }, {});
    const variant = product.variants.find((variant) => {
      return variant.selectedOptions.every((selectedOption) => {
        return selectedOption.value === values[selectedOption.name];
      });
    });
    form.setAttribute("value-variant-id", variant.id);
    checkQuantityIsInLimit();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("productForm");
    const variantId = form.getAttribute("value-variant-id");
    const quantity = parseInt(form.getAttribute("value-quantity"));
    const variant = product.variants.find(
      (variant) => variant.id === variantId
    );
    addItem({ item: { ...variant, product_title: product.title }, formQuantity: quantity });
    checkQuantityIsInLimit();
  };

  useEffect(() => {
    checkQuantityIsInLimit();
  }, [cartItems]);

  const { checkout, isLoading: checkoutLoading } = useCheckoutOnStore({
    store_id: campaign.storeId,
    cart_items: cartItems,
  });

  const checkoutButtonClick = async () => {
    const checkoutUrl = checkout.checkout.web_url;
    window.open(checkoutUrl, "_self");
  };

  return (
    <div className="container mx-auto p-8">
      <div className="relative grid grid-cols-1 gap-16 md:grid-cols-2">
        <div className="">
          {product.images.map((image, index) => (
            <img
              src={image.url}
              alt="Product Image"
              className="mb-4 w-full"
              key={index}
            />
          ))}
        </div>
        <div className="sticky top-20 h-fit">
          <h1 className="mb-4 text-2xl font-semibold">{product.title}</h1>
          <p className="text-l mb-4">{product.description}</p>
          <p className="mb-2 text-lg">
            <span className="mr-1 line-through">
              {currencyFormatter(product.priceRangeV2.maxVariantPrice)}
            </span>
            <span className="font-semibold">
              {currencyFormatter(product.priceRangeV2.minVariantPrice)}
            </span>
          </p>
          <form
            id="productForm"
            value-variant-id={product.variants[0].id}
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
            <button
              type="submit"
              className="mt-4 cursor-pointer rounded bg-[#555555] px-4 py-2 uppercase text-white disabled:opacity-50"
              onClick={onSubmit}
              disabled={!addToCartBtnEnabled}
            >
              {addToCartBtnEnabled ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              type="button"
              onClick={checkoutButtonClick}
              disabled={checkoutLoading}
              className="mt-4 cursor-pointer rounded bg-[#555555] px-4 py-2 uppercase text-white disabled:opacity-50"
            >
              {checkoutLoading ? "Loading..." : "Checkout"}
            </button>
          </form>

          {/* Remove on production */}
          <CartTesting {...{ campaign }} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
