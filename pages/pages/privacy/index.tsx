import React from "react";
import PrivacyPolicy from "@/components/atelier-landing-page/pages/PrivacyPolicy";
import { useTina } from "tinacms/dist/react";
import client from "@/tina/__generated__/client";
import { Privacy } from "@/tina/__generated__/types";

interface Props {
  query: any;
  variables: any;
  data: {
    privacy: Privacy;
  };
}

const PrivacyPolicyPage = (props: Props) => {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  return <PrivacyPolicy data={data?.privacy} />;
};

export default PrivacyPolicyPage;

export const getStaticProps = async () => {
  let data = {};
  let query = {};
  let variables = { relativePath: `Privacy-Policy.json` };
  try {
    const res = await client.queries.privacy(variables);
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
