import { useBilling } from "@/context/BillingProvider";
import {
  Button,
  Card,
  Divider,
  Grid,
  InlineStack,
  Icon,
  Link,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { CheckIcon, MinusIcon } from "@shopify/polaris-icons";

const OnboardingPage = () => {
  const { subscribe } = useBilling();

  return (
    <Page>
      <BlockStack gap="800">
        <BlockStack gap="400">
          <Text as="h1" variant="heading3xl">
            Join our beta
          </Text>

          <Text as="p" variant="bodyLg">
            Atelier is fully functional but we decided to release a discounted version to early adopters in exchange for feedback.
            <br />
            All subscriptions are 80% off for a full year. You  won't be charged during the first 8 weeks.
          </Text>
        </BlockStack>

        <Grid columns={{ sm: 1, md: 2, lg: 2 }}>
          <Grid.Cell>
            <Card>
              <BlockStack gap="400">
                <Text as="h6" variant="headingMd" fontWeight="medium">
                  Beta Mode | Free Trial + 80% off
                </Text>
                <InlineStack gap="200">
                  <Text as="span" variant="headingXl" tone="subdued"><s>$99</s></Text>
                  <Text as="p" variant="headingXl">$19 / month</Text>
                </InlineStack>
                <Text as="p" tone="success" fontWeight="semibold">
                  8 week free trial. Lock in beta pricing for a full year.
                </Text>

                <BlockStack gap="600">
                  <Divider />
                
                  <BlockStack gap="200">
                    <InlineStack align="start" gap="200">
                      <div>
                        <Icon source={CheckIcon} tone="success" />
                      </div>

                      <Text as="p" variant="bodyLg">
                        Create unlimited, password-protected private sales
                      </Text>
                    </InlineStack>

                    <InlineStack align="start" gap="200">
                      <div>
                        <Icon source={CheckIcon} tone="success" />
                      </div>

                      <Text as="p" variant="bodyLg">
                        Publish collections exclusively to Atelier
                      </Text>
                    </InlineStack>

                    <InlineStack align="start" gap="200">
                      <div>
                        <Icon source={CheckIcon} tone="success" />
                      </div>

                      <Text as="p" variant="bodyLg">
                        White glove support for a full year
                      </Text>
                    </InlineStack>
                  </BlockStack>

                  <Button
                    variant="primary"
                    onClick={() => subscribe({ plan: "BETA" })}
                  >
                    Subscribe to Beta
                  </Button>
                </BlockStack>
              </BlockStack>
            </Card>
          </Grid.Cell>

          {/**
           * PRO PLAN COMING SOON!!
           */}
          {/* <Grid.Cell>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="bodyLg">
                  Premium
                </Text>
                <Text as="p" variant="headingXl">
                  $99 / month
                </Text>
                <Text as="p" tone="success" fontWeight="bold">
                  8 week free trial
                </Text>

                <Divider />

                <BlockStack gap="200">
                  <InlineStack align="start" gap="200">
                    <div>
                      <Icon source={CheckIcon} tone="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Create as many sales as you want
                    </Text>
                  </InlineStack>

                  <InlineStack align="start" gap="200">
                    <div>
                      <Icon source={CheckIcon} tone="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Add all the products you want
                    </Text>
                  </InlineStack>

                  <InlineStack align="start" gap="200">
                    <div>
                      <Icon source={CheckIcon} tone="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Password protect your sale
                    </Text>
                  </InlineStack>

                  <InlineStack align="start" gap="200">
                    <div>
                      <Icon source={CheckIcon} tone="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Remove Atelier branding
                    </Text>
                  </InlineStack>
                </BlockStack>

                <Button
                  variant="primary"
                  onClick={() => subscribe({ plan: "PREMIUM" })}
                >
                  Subscribe to Premium
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell> */}
        </Grid>

        <Text as="p" variant="bodyLg">
          Any questions? Reach out to 
          <Link monochrome url="mailto:atelier@lumber.dev" removeUnderline>
            <b> atelier@lumber.dev</b>
          </Link>
          .
        </Text>
      </BlockStack>
    </Page>
  );
};

export default OnboardingPage;
