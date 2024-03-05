import React from "react";
import Faq from "@/components/atelier-landing-page/pages/Faq";
import { useTina } from "tinacms/dist/react";
import client from "@/tina/__generated__/client";
import { Faq as FaqType } from "@/tina/__generated__/types";

interface Props {
  query: any;
  variables: any;
  data: {
    faq: FaqType;
  };
}

const FaqPage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  return <Faq data={data?.faq} />;
};

export default FaqPage;

export const getStaticProps = async () => {
  let data = {};
  let query = {};
  let variables = { relativePath: `Frequently-Asked-Questions.json` };
  try {
    const res = await client.queries.faq(variables);
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
