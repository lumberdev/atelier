import AtelierLandingPage from "@/components/atelier-landing-page";
import TinaTestPage from "@/components/atelier-landing-page/TinaTestPage";
import client from "@/tina/__generated__/client";
import { NextUIProvider } from "@nextui-org/react";

const HomePage = (props) => {
  // const res = await client.queries.page({ relativePath: "homePage.json" });
  return (
    <NextUIProvider>
      <TinaTestPage
        data={props.data}
        query={props.query}
        variables={props.variables}
      />
      <AtelierLandingPage />
    </NextUIProvider>
  );
};

export default HomePage;

export const getStaticProps = async ({ params }) => {
  let data = {};
  let query = {};
  let variables = { relativePath: `homePage.json` };
  try {
    const res = await client.queries.page(variables);
    query = res.query;
    data = res.data;
    variables = res.variables;
  } catch {
    // swallow errors related to document creation
  }

  return {
    props: {
      variables: variables,
      data: data,
      query: query,
      //myOtherProp: 'some-other-data',
    },
  };
};
