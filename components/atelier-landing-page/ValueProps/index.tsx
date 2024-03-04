import React from "react";
import ValuePropItem from "./ValuePropItem";
import { PageValueProps } from "@/tina/__generated__/types";

const ValueProps = ({ data }: { data: PageValueProps }) => {
  return (
    <div id="features" className="w-full">
      {data.valueProps.map((valueProp) => (
        <ValuePropItem
          key={valueProp.title}
          title={valueProp.title}
          subtitle={valueProp.subtitle}
        />
      ))}
    </div>
  );
};

export default ValueProps;
