import withMiddleware from "@/utils/middleware/withMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(100).send("Must be POST");
  }
  const { body } = req;
  const shop = req.body.shop_domain;
  console.log("gdpr/customers_redact", body, shop);

  return res.status(200).send(`customer redact completed on ${shop}`);
};

export default withMiddleware("verifyHmac")(handler);
