import React, { MouseEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LogoTitle from "./LogoTitle";
import { getTextColor } from "@/lib/helper/colors";
import AnnouncementBar from "./AnnouncementBar";
import Container from "./general/Container";
import classNames from "classnames";
import { FC } from "react";
import MiniCart from "./cart/MiniCart";
import getProductListing from "@/lib/campaign/getProductListing";
import { useTheme } from "@/context/ThemeProvider";
import MobileNav from "@/components/navigation/MobileNav";

const Header: FC<{
  title: string;
  campaignHandle: string;
  announcement?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;
  categories?: string[];
  allProducts?: Awaited<
    ReturnType<typeof getProductListing>
  >["products"]["nodes"];
  setProducts?: (
    products: Awaited<ReturnType<typeof getProductListing>>["products"]["nodes"]
  ) => void;
}> = ({
  campaignHandle,
  title,
  announcement,
  announcementBgColor,
  announcementTextColor,
  categories = [],
  allProducts = [],
  setProducts = () => {},
}) => {
  const {
    global: { backgroundColor, logoPosition, logo },
  } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  // To make this work from a PDP, we need to get the base campaign path
  const baseCampaignPath =
    pathname === "/" ? "/" : "/" + pathname.split("/")[1];

  const textColor = getTextColor(backgroundColor);

  function filterProducts(
    event: MouseEvent<HTMLElement>,
    category: string = null
  ) {
    event.preventDefault();

    // Set products to display
    category
      ? setProducts(allProducts.filter((prod) => prod.tags.includes(category)))
      : setProducts(allProducts);

    // Set query string
    if (category) {
      router.replace(`${baseCampaignPath}?category=${category}`);
    } else {
      router.replace(baseCampaignPath);
    }
  }

  return (
    <div
      className="sticky left-0 top-0 z-10 lg:mb-4"
      style={{ color: textColor, backgroundColor }}
    >
      {announcement && (
        <AnnouncementBar
          announcement={announcement}
          announcementBgColor={announcementBgColor}
          announcementTextColor={announcementTextColor}
        />
      )}

      <Container className="grid w-full grid-cols-[1fr_3fr_1fr] items-center justify-between transition-all lg:relative lg:px-16 lg:py-4">
        <div
          className={classNames({
            "col-start-1": logoPosition === "center",
            "col-start-2": logoPosition !== "center",
          })}
        />

        {
          logo ? (
            <LogoTitle
              title={title}
              handle={campaignHandle}
              className={`col-start-2 row-start-1 justify-center ${classNames({
                "text-left lg:col-start-1 lg:justify-start":
                  logoPosition !== "center",
                "text-center lg:col-start-2": logoPosition === "center",
              })}`}
              logo={logo}
            />
          ) : title && (
            <h1 className={`col-start-2 row-start-1 justify-center ${classNames({
              "text-left lg:col-start-1 lg:justify-start" : logoPosition !== "center",
              "text-center lg:col-start-2": logoPosition === "center"
            })}`}>
              {title}
            </h1>
          )
        }

        <div
          className={`header-menu col-start-1 row-start-1 items-center justify-end
            ${classNames({
              "lg:col-start-2": (logo || title) && logoPosition !== "center",
              "lg:col-start-1": logoPosition === "center" || (!logo && !title),
            })}`}
        >
          {/* Desktop Navigation */}
          <ul
            className={`hidden items-center justify-center gap-12 text-center lg:flex ${classNames(
              {
                "lg:justify-start": logoPosition === "center" || (!logo && !title),
              }
            )}`}
          >
            <li>
              <a
                className="cursor-pointer"
                onClick={(event) => filterProducts(event)}
              >
                All
              </a>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <a
                  className="cursor-pointer"
                  onClick={(event) => filterProducts(event, category)}
                >
                  {category.replace("atelier:", "")}
                </a>
              </li>
            ))}
          </ul>
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNav categories={categories} onClick={filterProducts} />
          </div>
        </div>

        <div className="col-start-3 row-start-1 flex h-[40px] items-center justify-end">
          <MiniCart />
        </div>
      </Container>
    </div>
  );
};

export default Header;
