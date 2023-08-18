import { currencyFormatter } from "@/lib/helper/currency";
import React from "react";

const ProductPage = ({ product }) => {
  return (
    <div className="container mx-auto p-8">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="">
          {product.images.map((image, index) => (
            <img
              src={image.url}
              alt="Product Image"
              className="w-full mb-4"
              key={index}
            />
          ))}
        </div>
        <div className="sticky top-20 h-fit">
          <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
          <p className="text-l mb-4">{product.description}</p>
          <p className="text-lg mb-2">
            <span className="line-through mr-1">
              {currencyFormatter(product.priceRangeV2.maxVariantPrice)}
            </span>
            <span className="font-semibold">
              {currencyFormatter(product.priceRangeV2.minVariantPrice)}
            </span>
          </p>
          <form className="mb-4 flex flex-col w-48">
            {product.options.map((option, index) => (
              <React.Fragment key={index}>
                <label
                  htmlFor={option.name}
                  className="block mb-2"
                  key={`label${index}`}
                >
                  {option.name}:
                </label>
                <select
                  name={option.name}
                  id={option.name}
                  className="border rounded p-2 "
                  key={`select${index}`}
                >
                  {option.values.map((value, index) => (
                    <option value={value} key={index}>
                      {value}
                    </option>
                  ))}
                </select>
              </React.Fragment>
            ))}
            <button
              type="submit"
              className="bg-[#555555] uppercase text-white py-2 px-4 rounded mt-4 cursor-pointer"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
