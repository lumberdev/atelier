import { FC, useEffect, useState } from "react";
import Container from "./general/Container";
import { useRouter } from "next/router";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";

const PreviewModeBanner: FC<{ canPreviewAccessPage?: boolean }> = ({
  canPreviewAccessPage = false,
}) => {
  const router = useRouter();
  const [isPasswordPage, setIsPasswordPage] = useState(false);

  const closePreview = () => {
    document.cookie = "preview_token=;path=/;max-age=-1";
    router.replace("/");
  };

  useEffect(() => {
    const [pathname] = router.asPath.split("?");
    router.replace(pathname, undefined, { shallow: true });
  }, []);

  useEffect(() => {
    setIsPasswordPage(router.asPath.includes("/password"));
  }, [router.pathname]);

  return (
    <aside className="fixed bottom-0 left-0 right-0 bg-brand-3 shadow-md">
      <Container className="flex flex-col px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
        <div className="mb-4 flex items-center justify-center font-semibold md:mb-0 md:justify-start">
          {canPreviewAccessPage
            ? `You're previewing:`
            : `You're previewing the campaign page`}

          {canPreviewAccessPage && (
            <div className="relative">
              <select
                value={isPasswordPage ? "password" : "campaign"}
                onChange={({ target: { value } }) => {
                  if (value === "password")
                    return router.push(
                      `/${router.query["campaign_handle"]}/password`
                    );

                  router.push(router.asPath.split("/password")[0]);
                }}
                className="c-select ml-2 inline border-2 border-black/40 bg-transparent py-1 pl-2 pr-8 text-left align-middle"
              >
                <option value="campaign">Campaign Page</option>
                <option value="password">Password Page</option>
              </select>
            </div>
          )}
        </div>

        <button
          className="w-full bg-black px-4 py-2 font-bold text-white md:w-max"
          onClick={closePreview}
        >
          Close Preview
        </button>
      </Container>
    </aside>
  );
};

export default PreviewModeBanner;
