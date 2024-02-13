#!/bin/bash

# Start ngrok before running this script

# Wait for ngrok to start and capture the forwarding URL
while true; do
  ngrok_url=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[] | select(.proto == "https").public_url')
  if [[ -n $ngrok_url ]]; then
    break
  fi
  sleep 1
done

# Check if SHOPIFY_APP_URL already exists in .env file
if grep -q '^SHOPIFY_APP_URL=' .env; then
  # Replace the existing value with the new ngrok_url
  sed -i.bak "s|^SHOPIFY_APP_URL=.*|SHOPIFY_APP_URL=$ngrok_url|" .env
else
  # If it doesn't exist, add ngrok URL to .env file
  echo "SHOPIFY_APP_URL=$ngrok_url" >> .env
fi

# Check if SHOPIFY_APP_URL_OPEN already exists in .env file
if grep -q '^SHOPIFY_APP_URL_OPEN=' .env; then
  # Replace the existing value with the new ngrok_url
  sed -i.bak "s|^SHOPIFY_APP_URL_OPEN=.*|SHOPIFY_APP_URL_OPEN=$ngrok_url/api/auth?shop=river-theme.myshopify.com|" .env
else
  # If it doesn't exist, add ngrok URL to .env file
  echo "SHOPIFY_APP_URL_OPEN=$ngrok_url/api/auth?shop=river-theme.myshopify.com" >> .env
fi

# Run npm update:url
npm update:url

# Display the URL for confirmation
echo "Shopify App: $ngrok_url/api/auth?shop=river-theme.myshopify.com"

# Run npm dev in the background
npm run dev 