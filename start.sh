#!/bin/bash

source .env

# Split terminal into 2 windows
tmux new-session -d -s my_session
tmux split-window -h -p 40 \; split-window -h -p 50
tmux send-keys -t my_session:0.0 "npm run ngrok --authtoken $(echo $NGROK_TOKEN)" C-m
tmux select-pane -t my_session:0.2
tmux send-keys -t my_session:0.2 "$(cat <<EOF

# Find forwarding address and update .env file
    echo "Waiting for ngrok to become ready..."
    while true; do
        status=\$(curl -s http://localhost:4040/api/tunnels)
        if [[ \$status == *"public_url"* ]]; then
            break
        fi
        sleep 1
    done
    forwarding_address=\$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
    existing_value=\$(grep -oP '^SHOPIFY_APP_URL="\K[^"]*' .env)
    awk -v old="\$existing_value" -v new="\$forwarding_address" 'BEGIN{FS=OFS="="} \$1=="SHOPIFY_APP_URL" {gsub(old,new)}1' .env > temp.env && mv temp.env .env
    npm update:url

# Start the development server
    tmux send-keys -t my_session:0.1 'npm run dev' C-m
    sleep 5
    google-chrome "\$forwarding_address/api/auth?shop=river-theme.myshopify.com" && exit

EOF
)" C-m

tmux attach-session -t my_session