import * as React from "react";
const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M1.5 5h1.667m0 0H16.5M3.167 5v11.667a1.667 1.667 0 0 0 1.666 1.666h8.334a1.667 1.667 0 0 0 1.666-1.666V5H3.167Zm2.5 0V3.333a1.667 1.667 0 0 1 1.666-1.666h3.334a1.667 1.667 0 0 1 1.666 1.666V5"
    />
  </svg>
);
export default TrashIcon;
