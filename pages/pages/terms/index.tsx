import React from "react";
import TermsAndConditions from "@/components/atelier-landing-page/pages/TermsAndConditions";
import { useTina } from "tinacms/dist/react";
import client from "@/tina/__generated__/client";
import { Terms } from "@/tina/__generated__/types";

interface Props {
  query: any;
  variables: any;
  data: {
    terms: Terms;
  };
}

const TermsAndConditionsPage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  return <TermsAndConditions data={data?.terms} />;
};

export default TermsAndConditionsPage;

export const getStaticProps = async () => {
  let data = {};
  let query = {};
  let variables = { relativePath: `Terms--Conditions.json` };
  try {
    const res = await client.queries.terms(variables);
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
