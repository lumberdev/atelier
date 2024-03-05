import React from "react";
import Layout from "@/components/atelier-landing-page/general/Layout";
import PageHeader from "@/components/atelier-landing-page/general/PageHeader";
import PageContent from "@/components/atelier-landing-page/general/PageContent";
import PageContainer from "@/components/atelier-landing-page/general/PageContainer";
import { Terms } from "@/tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";

interface TermsAndConditionsProps {
  data?: Terms;
}

const TermsAndConditions = ({ data }: TermsAndConditionsProps) => {
  const { title, body } = data || {};
  return (
    <Layout className="flex min-h-screen flex-col">
      <PageContainer>
        <PageHeader>{title}</PageHeader>
        <PageContent>
          <TinaMarkdown content={body} />
        </PageContent>
      </PageContainer>
    </Layout>
  );
};

export default TermsAndConditions;
