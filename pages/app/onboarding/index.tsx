import { useBilling } from "@/context/BillingProvider";
import {
  Button,
  Card,
  Divider,
  Grid,
  InlineStack,
  Icon,
  Layout,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { CheckIcon, MinusIcon } from "@shopify/polaris-icons";

const OnboardingPage = () => {
  const { subscribe } = useBilling();

  return (
    <Page>
      <BlockStack gap="2400">
        <BlockStack gap="400">
          <Text as="h1" variant="heading3xl">
            Select the right plan for you
          </Text>

          <Text as="p">All our plans include an 8 week free trial</Text>
        </BlockStack>

        <Grid columns={{ sm: 1, md: 2, lg: 2 }}>
          <Grid.Cell>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="bodyLg">
                  Starter
                </Text>
                <Text as="p" variant="headingXl">
                  $49 / month
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
                      <Icon source={MinusIcon} tone="subdued" />
                    </div>

                    <Text as="p" variant="bodyLg" tone="subdued">
                      <s>Remove Atelier branding</s>
                    </Text>
                  </InlineStack>
                </BlockStack>

                <Button
                  variant="primary"
                  onClick={() => subscribe({ plan: "STARTER" })}
                >
                  Subscribe to Starter
                </Button>
              </BlockStack>
            </Card>
          </Grid.Cell>

          <Grid.Cell>
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
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Page>
  );
};

export default OnboardingPage;
