import React from "react";
import Layout from "@/components/atelier-landing-page/general/Layout";
import PageHeader from "@/components/atelier-landing-page/general/PageHeader";
import PageContent from "@/components/atelier-landing-page/general/PageContent";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import PageContainer from "@/components/atelier-landing-page/general/PageContainer";
import { Privacy as PrivacyType } from "@/tina/__generated__/types";

interface PrivacyProps {
  data?: PrivacyType;
}

const Privacy = ({ data }: PrivacyProps) => {
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

export default Privacy;
