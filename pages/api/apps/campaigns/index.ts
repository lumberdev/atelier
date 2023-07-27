import withMiddleware from "@/utils/middleware/withMiddleware";
import prisma from "@/utils/prisma";

const handler = async (req, res) => {
  const shop = req.user_session.shop;

  const store = await prisma.stores.findUnique({ where: { shop } });

  if (!store)
    return res.status(500).json({
      error: {
        code: "UNABLE_TO_FIND_STORE",
        message: "Unable to find a store with the provided name",
      },
    });

  res.status(200).json({ identifier: store?.identifier, campaigns: [] });
};

export default withMiddleware("verifyRequest")(handler);
