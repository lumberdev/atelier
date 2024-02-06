import prisma from "@/utils/prisma";

const getMerchantTheme = async (identifier: string) => {
  const merchant = await prisma.stores.findUnique({
    where: { identifier },
    select: {
      theme: true,
    },
  });

  const theme = merchant.theme;

  return theme;
};

export default getMerchantTheme;
