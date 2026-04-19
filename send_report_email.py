#!/usr/bin/env python3
import os
import sys

# Set environment variables
os.environ['AGENTMAIL_API_KEY'] = 'am_us_4966f926fb2b75aa5bcd3f7a94ee9b57ab11a189ce023ce8cefec1cc74c716bf'
os.environ['AGENTMAIL_INBOX'] = 'lonelysalt605@agentmail.to'

# Import and run the agentmail script
sys.path.insert(0, '/Users/ava/.openclaw/skills/agentmail/scripts')

# Read the send_email.py script and execute it with our parameters
exec(open('/Users/ava/.openclaw/skills/agentmail/scripts/send_email.py').read())
