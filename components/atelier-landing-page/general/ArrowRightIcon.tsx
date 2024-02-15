import * as React from "react";
const ArrowRightIcon = ({ color = "#fff" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={21} fill="none">
    <g stroke={color} strokeMiterlimit={10} strokeWidth={2} clipPath="url(#a)">
      <path d="m9.93 20.432 9.931-9.931L9.931.568M0 10.501h19.861" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 .5h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default ArrowRightIcon;
