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
   - Copy client ID & client secret from your app in the [Partner's Dashboard](https://partners.shopify.com/1011478/apps) to `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET`
   - Fill in `DATABASE_URL` with your database connection URL
   - You can leave `SHOPIFY_APP_URL` empty for now, will be filled in the development workflow section
   - File uploads use the Supabase instance, in order to not mix prod and dev uploads we provide the `NEXT_PUBLIC_SUPABASE_STORAGE_KEY` variable that defines the folder where assets are saved. You can check the name of your folder in [Supabase](https://app.supabase.com/project/lypfjowlwsqnrjphjfgs/storage/buckets)
5. Push the database schema to your database with `yarn prisma db push`

## Development workflow

1. Start your local server with `yarn ngrok`
   - If ngrok is not globally authenticated you can pass the auth token manually:
     `yarn ngrok --authtoken <ngrok_token>`
2. Copy the forwarding `https` url from ngrok and add it to `SHOPIFY_APP_URL`
3. Update the Shopify App urls to point to your local server with `yarn update:url`
4. Open `<SHOPIFY_APP_URL>/api/auth?shop=<shopify store domain>` (ie `https://<id>.ngrok-free.app/api/auth?shop=river-theme.myshopify.com`)
   - This will open your development app (served by your local server) on the provided store

The script `start.sh` automates the above commands.
To run ensure your ngrok token is stored in `.env` as `NGROK_TOKEN` and that **tmux**, **jq**, **awk** & **google-chrome** are all working/installed.
