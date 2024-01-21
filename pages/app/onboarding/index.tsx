import { useBilling } from "@/context/BillingProvider";
import {
  Button,
  Card,
  Divider,
  Grid,
  HorizontalStack,
  Icon,
  Layout,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { TickMinor, MinusMinor } from "@shopify/polaris-icons";

const OnboardingPage = () => {
  const { subscribe } = useBilling();

  return (
    <Page>
      <VerticalStack gap="24">
        <VerticalStack gap="4">
          <Text as="h1" variant="heading3xl">
            Select the right plan for you
          </Text>

          <Text as="p">All our plans include an 8 week free trial</Text>
        </VerticalStack>

        <Grid columns={{ sm: 1, md: 2, lg: 2 }}>
          <Grid.Cell>
            <Card>
              <VerticalStack gap="4">
                <Text as="h2" variant="bodyLg">
                  Starter
                </Text>
                <Text as="p" variant="headingXl">
                  $49 / month
                </Text>
                <Text as="p" color="success" fontWeight="bold">
                  8 week free trial
                </Text>

                <Divider />

                <VerticalStack gap="2">
                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Create as many sales as you want
                    </Text>
                  </HorizontalStack>

                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Add all the products you want
                    </Text>
                  </HorizontalStack>

                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Password protect your sale
                    </Text>
                  </HorizontalStack>

                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={MinusMinor} color="subdued" />
                    </div>

                    <Text as="p" variant="bodyLg" color="subdued">
                      <s>Remove Atelier branding</s>
                    </Text>
                  </HorizontalStack>
                </VerticalStack>

                <Button primary onClick={() => subscribe({ plan: "STARTER" })}>
                  Subscribe to Starter
                </Button>
              </VerticalStack>
            </Card>
          </Grid.Cell>

          <Grid.Cell>
            <Card>
              <VerticalStack gap="4">
                <Text as="h2" variant="bodyLg">
                  Premium
                </Text>
                <Text as="p" variant="headingXl">
                  $99 / month
                </Text>
                <Text as="p" color="success" fontWeight="bold">
                  8 week free trial
                </Text>

                <Divider />

                <VerticalStack gap="2">
                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Create as many sales as you want
                    </Text>
                  </HorizontalStack>

                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Add all the products you want
                    </Text>
                  </HorizontalStack>

                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Password protect your sale
                    </Text>
                  </HorizontalStack>

                  <HorizontalStack align="start" gap="2">
                    <div>
                      <Icon source={TickMinor} color="success" />
                    </div>

                    <Text as="p" variant="bodyLg">
                      Remove Atelier branding
                    </Text>
                  </HorizontalStack>
                </VerticalStack>

                <Button primary onClick={() => subscribe({ plan: "PREMIUM" })}>
                  Subscribe to Premium
                </Button>
              </VerticalStack>
            </Card>
          </Grid.Cell>
        </Grid>
      </VerticalStack>
    </Page>
  );
};

export default OnboardingPage;
