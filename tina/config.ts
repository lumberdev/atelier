import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        fields: [
          {
            label: "Hero",
            name: "hero",
            type: "object",
            fields: [
              {
                name: "marquee_text_1",
                label: "Marquee Text 1",
                type: "string",
              },
              {
                name: "marquee_text_2",
                label: "Marquee Text 2",
                type: "string",
              },
            ],
          },
          {
            label: "About",
            name: "about",
            type: "object",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                isTitle: true,
                required: true,
              },
              {
                label: "Body",
                name: "body",
                isBody: true,
                type: "rich-text",
              },
              {
                label: "Use Cases",
                name: "useCases",
                type: "string",
                list: true,
              },
            ],
          },
          {
            label: "Value Props",
            name: "valueProps",
            type: "object",
            fields: [
              {
                label: "Value Prop",
                name: "valueProps",
                type: "object",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    isTitle: true,
                    required: true,
                  },
                  {
                    type: "string",
                    name: "subtitle",
                    label: "Subtitle",
                    isTitle: true,
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            label: "Pricings",
            name: "pricings",
            type: "object",
            fields: [
              {
                label: "Pricing",
                name: "pricing",
                type: "object",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    isTitle: true,
                    required: true,
                  },
                  {
                    type: "string",
                    name: "rate",
                    label: "Rate",
                    required: true,
                  },
                  {
                    label: "Features",
                    name: "features",
                    type: "string",
                    list: true,
                  },
                ],
              },
            ],
          },
        ],
        ui: {
          router: () => "/",
        },
      },
      {
        name: "faq",
        label: "Faq",
        path: "content/faq",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            label: "Body",
            name: "body",
            isBody: true,
            type: "rich-text",
          },
        ],
        ui: {
          router: () => "/pages/faq",
        },
      },
      {
        name: "privacy",
        label: "Privacy Policy",
        path: "content/privacy",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            label: "Body",
            name: "body",
            isBody: true,
            type: "rich-text",
          },
        ],
        ui: {
          router: () => "/pages/privacy",
        },
      },
      {
        name: "terms",
        label: "Terms and Conditions",
        path: "content/terms",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            label: "Body",
            name: "body",
            isBody: true,
            type: "rich-text",
          },
        ],
        ui: {
          router: () => "/pages/terms",
        },
      },
    ],
  },
});


