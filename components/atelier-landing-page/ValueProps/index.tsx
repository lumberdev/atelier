import React from "react";
import ValuePropItem from "./ValuePropItem";

const DummyValueProps = [
  {
    id: 1,
    title: "INSTANTLY EXCLUSIVE",
    description:
      "Atelier empowers you to create private, invite-only shopping experiences. Control access and turn every visit into a VIP affair.",
    url: "/",
  },
  {
    id: 2,
    title: "EFFORTLESS SETUP",
    description:
      "No coding, no headaches. Craft your mini store with a few clicks, choosing from stunning templates that reflect your brand's essence.",
    url: "/",
  },
  {
    id: 3,
    title: "BOOST SALES AND LOYALTY",
    description:
      "Drive demand by offering exclusive deals to selected customers. Foster a sense of exclusivity that keeps them coming back for more.",
    url: "/",
  },
  {
    id: 4,
    title: "SEAMLESS INTEGRATION",
    description:
      "Atelier seamlessly integrates with your Shopify store, preserving your existing setup while adding a touch of exclusivity.",
    url: "/",
  },
];

const ValueProps = () => {
  return (
    <div className="w-full">
      {DummyValueProps.map((valueProp) => (
        <ValuePropItem
          key={valueProp.id}
          title={valueProp.title}
          description={valueProp.description}
          url={valueProp.url}
        />
      ))}
    </div>
  );
};

export default ValueProps;
