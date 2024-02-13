# Atelier

Private sales for your Shopify store.

## Requirements

- Node.js (v18.17.0 or newer)
- NPM
- (For local development) A PostgreSQL database

## Up and Running

1. Create a local PostgreSQL database
2. Install dependencies with `npm install`
3. Create your development app on the [Shopify Partner Dashboard](https://partners.shopify.com/1011478/apps)

   - Click `Create App`
   - Choose `Create App Manually`
   - Add a name in the format `Atelier - <Your Name>` so you can identify it easily

4. Duplicate `.env.example` and rename to `.env`. Fill in the variables with the app API values.
   - Copy client ID & client secret from your app in the [Partner's Dashboard](https://partners.shopify.com/1011478/apps) to `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET`
   - Fill in `DATABASE_URL` with your database connection URL
   - Add the following API scopes: `read_products,read_checkouts,write_checkouts`
   - You can leave `SHOPIFY_APP_URL` empty for now, will be filled in the development workflow section
   - File uploads use the Supabase instance, in order to not mix prod and dev uploads we provide the `NEXT_PUBLIC_SUPABASE_STORAGE_KEY` variable that defines the folder where assets are saved. You can check the name of your folder in [Supabase](https://app.supabase.com/project/lypfjowlwsqnrjphjfgs/storage/buckets)
5. Push the database schema to your database with `npm run prisma db push`
6. Enable customer data usage (otherwise checkout will not work). (Full instructions [here](https://shopify.dev/docs/apps/store/data-protection/protected-customer-data#request-access-to-protected-customer-data)):

   - Go to the partners dashboard
   - `Apps -> All apps -> <YOUR_APP> -> API ACCESS`
   - Find heading _Protected customer data access_ and click _Request access_
   - Complete Step 1 `Select your data use and reasons`
   - **You do not to complete Step 2 for development.** Only prior to app submission.


## Development workflow

1. Start your local server with `npm run ngrok`
   - If ngrok is not globally authenticated you can pass the auth token manually:
     `npm run ngrok --authtoken <ngrok_token>`
2. Copy the forwarding `https` url from ngrok and add it to `SHOPIFY_APP_URL`
3. Update the Shopify App urls to point to your local server with `npm run update:url`
4. Open `<SHOPIFY_APP_URL>/api/auth?shop=<shopify store domain>` (ie `https://<id>.ngrok-free.app/api/auth?shop=river-theme.myshopify.com`)
   - This will open your development app (served by your local server) on the provided store

The script `start.sh` automates the above commands.
To run ensure your ngrok token is stored in `.env` as `NGROK_TOKEN` and that **tmux**, **jq**, **awk** & **google-chrome** are all working/installed.
