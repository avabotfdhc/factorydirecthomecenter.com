# Infrastructure Setup for M4 Pro Mac Mini

## Machine Specs (Confirmed)
- **Model**: Mac Mini M4 Pro (12-core CPU, 16-core GPU)
- **RAM**: 24GB Unified Memory
- **Storage**: Internal SSD + External 2TB recommended
- **macOS**: 26.3.1

## Network Setup

### 1. Ethernet Connection (Primary)
```bash
# Check current connection
ifconfig en0 | grep "inet "
# Should show wired connection for reliability
```

### 2. Tailscale for Remote Access
```bash
# Install Tailscale
brew install tailscale

# Start Tailscale
sudo tailscale up

# Get your Tailscale IP
tailscale ip -4
```

### 3. UPS Battery Backup
**Recommended**: APC Back-UPS BE600M1 ($80-100)
- Provides 5-15 minutes runtime during outages
- Graceful shutdown protection
- USB connection for auto-shutdown

## Storage Architecture

### Current: Internal SSD
- OpenClaw installation: `/opt/homebrew/lib/node_modules/openclaw/`
- Workspace: `~/.openclaw/workspace/`
- Config: `~/.openclaw/openclaw.json`

### Recommended: External 2TB SSD
```
/Volumes/FDHC-Data/
├── workspace-backup/     # Daily workspace backup
├── time-machine/         # Time Machine backup
├── deliverables/         # Large project files
└── archive/              # Old memory files, logs
```

### Backup Strategy
1. **Time Machine**: External SSD, hourly backups
2. **Git**: Workspace in private GitHub repo
3. **Config backup**: `~/.openclaw/` to cloud storage

## Power Management

### Prevent Sleep (for 24/7 operation)
```bash
# Disable sleep when plugged in
sudo pmset -c sleep 0

# Disable display sleep
sudo pmset -c displaysleep 0

# Check settings
pmset -g
```

### Auto-Restart After Power Failure
```bash
sudo pmset -c autorestart 1
```

## Monitoring

### System Health Checks
- CPU/Memory: `htop` or Activity Monitor
- Disk usage: `df -h`
- Network: `ping 1.1.1.1`
- OpenClaw status: `openclaw gateway status`

### Log Rotation
OpenClaw logs auto-rotate in `~/.openclaw/logs/`

## Security

### Firewall
```bash
# Enable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# Allow OpenClaw
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /opt/homebrew/bin/openclaw
```

### File Permissions
Workspace files: `drwx------` (owner only)
Config files: `-rw-------` (owner only)

## Next Steps
1. [ ] Connect external SSD
2. [ ] Set up Time Machine
3. [ ] Install and configure Tailscale
4. [ ] Connect UPS
5. [ ] Configure power settings
6. [ ] Test remote access
