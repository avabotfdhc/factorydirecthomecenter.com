#!/bin/bash
export AGENTMAIL_API_KEY="am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf"
python3 ~/.openclaw/skills/agentmail/scripts/send_email.py \
  --inbox "lonelysalt605@agentmail.to" \
  --to "kdudgeon@factorydirecthomescenter.com" \
  --subject "Daily Industry Research - April 8, 2026" \
  --attach "/Users/ava/.openclaw/workspace/daily_report.txt" \
  --text "See attached report for today's industry research findings."