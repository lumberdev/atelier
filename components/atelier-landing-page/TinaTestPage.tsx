"use client";

import { PageQuery, PageQueryVariables } from "@/tina/__generated__/types";
import React from "react";
import { useTina } from "tinacms/dist/react";

interface TinaTestPageProps {
  data: PageQuery;
  variables: PageQueryVariables;
  query: string;
}

const TinaTestPage = (props: TinaTestPageProps) => {
  const { data } = useTina({
    data: props.data,
    query: props.query,
    variables: props.variables,
  });
  return <div className="text-[5rem]">{data.page?.subtitle}</div>;
};

export default TinaTestPage;
