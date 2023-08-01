# Atelier

Private sales for your Shopify store.

## Requirements

- Node.js (v18.17.0 or newer)
- Yarn (v1.22.19 or newer)
- (For local development) A PostgreSQL database

## Up and Running

1. Create a local PostgreSQL database
2. Install dependencies with `yarn install`
3. Create your development app on the [Shopify Partner Dashboard](https://partners.shopify.com/1011478/apps)

- Click `Create App`
- Choose `Create App Manually`
- Add a name in the format `Atelier - <Your Name>` so you can identify it easily

4. Duplicate `.env.example` and rename to `.env`. Fill in the variables with the app API values.

- Fill in `DATABASE_URL` with your database connection URL
- You can leave `SHOPIFY_APP_URL` empty for now, will be filled in the development workflow section

## Development workflow

1. Start your local server with `yarn ngrok`
2. Copy the forwarding `https` url from ngrok and add it to `SHOPIFY_APP_URL`
3. Update the Shopify App urls to point to your local server with `yarn update:url`
4. Open `<SHOPIFY_APP_URL>/api/auth?shop=<shopify store domain>` (ie `https://<id>.ngrok-free.app/api/auth?shop=river-theme.myshopify.com`)

- This will open your development app (served by your local server) on the provided store
