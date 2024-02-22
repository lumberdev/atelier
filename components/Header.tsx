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
  categories?: string[];
  allProducts?: Awaited<ReturnType<typeof getProductListing>>["products"]["nodes"];
  setProducts?: (products: Awaited<ReturnType<typeof getProductListing>>["products"]["nodes"]) => void 
}> = ({ 
  campaignHandle, 
  title, 
  announcement, 
  categories = [], 
  allProducts = [], 
  setProducts = () => {} 
}) => {
  const {
    global: { primaryColor, logoPosition },
  } = useTheme();
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const textColor = getTextColor(primaryColor);

  function filterProducts(event: MouseEvent<HTMLElement>, category: string = null) {
    event.preventDefault();

    // Set products to display
    category ? setProducts(allProducts.filter((prod) => prod.tags.includes(category))) : setProducts(allProducts);

    // Set query string
    if(category) {
      router.replace(`${pathname}?category=${category}`);
    } else {
      router.replace(pathname);
    }
  }

  return (
    <div
      className="sticky left-0 top-0 z-10 lg:mb-4"
      style={{ backgroundColor: primaryColor, color: textColor }}
    >
      {announcement && <AnnouncementBar announcement={announcement} />}

      <Container className="grid w-full grid-cols-[1fr_3fr_1fr] items-center justify-between transition-all lg:relative lg:px-16 lg:py-4">
        <div
          className={classNames({
            "col-start-1": logoPosition === "center",
            "col-start-2": logoPosition !== "center",
          })}
        />

        <LogoTitle
          title={title}
          handle={campaignHandle}
          className={`row-start-1 col-start-2 justify-center ${classNames({
            "lg:col-start-1 lg:justify-start text-left": logoPosition !== "center",
            "lg:col-start-2 text-center": logoPosition === "center",
          })}`}
          color={textColor}
        />

        <div className="header-menu row-start-1 col-start-1 lg:col-start-2 items-center justify-end">
          {/* Desktop Navigation */}
          <ul className={`hidden lg:grid grid-cols-${(categories.length+1) > 4 ? "4" : categories.length+1} text-center`}>
            <li>
              <a className="cursor-pointer" onClick={(event) => filterProducts(event)}>All</a>
            </li>
            {categories.map((category) => (
              <li>
                <a className="cursor-pointer" onClick={(event) => filterProducts(event, category)}>{category.replace("atelier:", "")}</a>
              </li>
            ))}
          </ul>
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNav categories={categories} onClick={filterProducts} />
          </div>
        </div>
        

        <div className="row-start-1 col-start-3 flex h-[40px] items-center justify-end">
          <MiniCart />
        </div>
      </Container>
    </div>
  );
};

export default Header;
