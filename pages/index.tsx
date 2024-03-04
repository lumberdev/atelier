"use client";

import AtelierLandingPage from "@/components/atelier-landing-page";
import client from "@/tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Page } from "@/tina/__generated__/types";

interface Props {
  query: any;
  variables: any;
  data: {
    page: Page;
  };
}

const HomePage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  return <AtelierLandingPage data={data?.page} />;
};

export default HomePage;

export const getStaticProps = async () => {
  let data = {};
  let query = {};
  let variables = { relativePath: `landing-page.json` };
  try {
    const res = await client.queries.page(variables);
    query = res.query;
    data = res.data;
    variables = res.variables;
  } catch {
    console.error("Failed to load page data");
  }

  return {
    props: {
      variables: variables,
      data: data,
      query: query,
    },
  };
};
