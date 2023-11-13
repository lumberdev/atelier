import * as React from "react";
const CartFilled = ({ color = "black" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} fill={"none"}>
    <path
      fill={color}
      fillRule="evenodd"
      d="M19.692 6.69a4.75 4.75 0 0 0-4.75 4.75V12h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33l-.77-11.6h-3.16v-.57a4.75 4.75 0 0 0-4.75-4.75Zm3.75 4.75V12h-7.5v-.56a3.75 3.75 0 0 1 7.5 0Zm0 1.56h-7.5v.56a3.75 3.75 0 0 0 7.5 0V13Zm-8.5.56V13h-2.22l-.72 10.67a4 4 0 0 0 4 4.27h7.38a4 4 0 0 0 3.99-4.27L26.662 13h-2.22v.56a4.75 4.75 0 0 1-9.5 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default CartFilled;
