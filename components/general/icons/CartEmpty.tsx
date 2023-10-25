import * as React from "react";
const CartEmpty = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M14.942 12h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33L27.592 12h-12.65Zm-2.22 1h2.22v.63a4.75 4.75 0 1 0 9.5 0V13h2.22l.72 10.67a4 4 0 0 1-4 4.27h-7.38a4 4 0 0 1-3.99-4.27l.71-10.67Zm3.22 0h7.5v.63a3.75 3.75 0 1 1-7.5 0V13Z"
      clipRule="evenodd"
    />
  </svg>
);
export default CartEmpty;
