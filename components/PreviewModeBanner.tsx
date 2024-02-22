import { useEffect } from "react";
import Container from "./general/Container";
import { useRouter } from "next/router";

const PreviewModeBanner = () => {
  const router = useRouter();

  const closePreview = () => {
    document.cookie = "preview_token=;path=/;max-age=-1";
    router.replace("/");
  };

  useEffect(() => {
    const [pathname] = router.asPath.split("?");
    router.replace(pathname, undefined, { shallow: true });
  }, []);

  return (
    <aside className="fixed bottom-0 left-0 right-0 bg-brand-3 shadow-md">
      <Container className="flex flex-col px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8 md:py-8">
        <p className="mb-2 font-semibold md:mb-0">
          You're previewing this campaign
        </p>

        <button
          className="w-max bg-black px-4 py-2 font-bold text-white"
          onClick={closePreview}
        >
          Close Preview
        </button>
      </Container>
    </aside>
  );
};

export default PreviewModeBanner;
