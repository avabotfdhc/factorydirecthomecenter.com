#!/bin/bash
export AGENTMAIL_API_KEY="am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf"
python3 ~/.openclaw/skills/agentmail/scripts/send_email.py \
  --inbox "lonelysalt605@agentmail.to" \
  --to "kdudgeon@factorydirecthomescenter.com,woodsells@outlook.com" \
  --subject "LinkedIn Account Recovery - Step-by-Step Guide" \
  --text "$(cat /Users/ava/.openclaw/workspace/email_body.txt)"