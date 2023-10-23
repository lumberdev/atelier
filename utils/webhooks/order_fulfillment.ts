import { ORDERS_CREATE } from "@/_developer/types/2023-07/webhooks";
import { WebhookHandlerFunction } from "@shopify/shopify-api";

const orderFulfillmentHandler: WebhookHandlerFunction = async (
  topic,
  shop,
  webhookRequestBody
) => {
  const order: ORDERS_CREATE = JSON.parse(webhookRequestBody);

  const atelierSourcedItems = order.line_items.filter((item) =>
    item.properties.includes("_source_atelier")
  );

  // TODO: Charge for each atelier sourced item in the order
};

export default orderFulfillmentHandler;
