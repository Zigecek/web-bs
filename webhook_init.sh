#!/bin/bash
apt install webhook
cd ~
mkdir -p webhook
cd webhook
touch webhook.yaml
echo "
- id: web-bs
  execute-command: $HOME/web-bs/git_pull.sh
  command-working-directory: $HOME/web-bs
  response-message: \"Web-bs webhook executed successfully\"
" >> webhook.yaml
touch /etc/systemd/system/webhook.service
echo "
[Unit]
Description=Webhook service
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
User=$USER
ExecStart=/usr/bin/webhook --hooks $HOME/webhook/webhook.yaml --port 9000 -verbose

[Install]
WantedBy=multi-user.target
" > /etc/systemd/system/webhook.service
systemctl daemon-reload
systemctl enable webhook
systemctl start webhook
systemctl restart webhook
systemctl status webhook