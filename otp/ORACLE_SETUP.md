# Oracle Cloud Free Tier VM Setup
# Gets you a permanent free ARM server with 24GB RAM for OTP

## 1. Create Oracle Cloud account

Go to: https://cloud.oracle.com/free
- Use a real credit card (required for verification, never charged on free tier)
- Select your home region — pick US West (Phoenix) or US East (Ashburn) for best latency

## 2. Create the VM

Dashboard → Compute → Instances → Create Instance

**Shape:**
  - Click "Change Shape"
  - Select: Ampere → VM.Standard.A1.Flex
  - OCPUs: 4
  - RAM: 24 GB
  - This is the free tier — $0/month forever

**Image:**
  - Canonical Ubuntu 22.04 (Minimal)

**Networking:**
  - Create new VCN (defaults are fine)
  - Assign a public IPv4 address: YES

**SSH Keys:**
  - Paste your public key (~/.ssh/id_rsa.pub)
  - Or generate a new one: ssh-keygen -t ed25519 -C "fixsactransit-otp"

→ Create Instance

Wait ~2 minutes. Copy the Public IP address.

## 3. Open firewall port 8080

Dashboard → Networking → Virtual Cloud Networks
→ Your VCN → Security Lists → Default Security List
→ Add Ingress Rule:
  - Source CIDR: 0.0.0.0/0
  - IP Protocol: TCP
  - Destination Port: 8080

Also open port 8080 in the VM's local firewall:

```bash
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
sudo netfilter-persistent save
```

## 4. SSH in and run setup

```bash
ssh ubuntu@YOUR_ORACLE_IP

# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/otp/setup.sh | bash
```

This takes about 15 minutes total:
- 5 min: downloading GTFS feeds (~500MB total)
- 10 min: building the OTP graph

## 5. Verify OTP is running

```bash
# Check service
sudo systemctl status otp

# Watch startup logs
sudo journalctl -u otp -f
# Wait for: "Grizzly server started"

# Test the API
curl "http://localhost:8080/otp/routers/default/index/feeds"
# Should return a JSON array of loaded feeds
```

## 6. Test a route (Sacramento pain factor)

```bash
curl "http://localhost:8080/otp/routers/default/plan?\
fromPlace=38.5516,-121.4685&\
toPlace=38.5802,-121.4931&\
time=08:00:00&\
date=04-21-2026&\
mode=TRANSIT,WALK&\
numItineraries=1" | python3 -m json.tool | head -50
```

## 7. Set the secret in Cloudflare

```bash
# From your local machine
npx wrangler secret put OTP_URL
# Enter: http://YOUR_ORACLE_IP:8080
```

## 8. Set up weekly GTFS refresh

```bash
# On the Oracle VM
sudo cp /opt/otp/refresh-gtfs.sh /opt/otp/refresh-gtfs.sh
sudo chmod +x /opt/otp/refresh-gtfs.sh

# Add to crontab (runs every Sunday at 3am)
(crontab -l 2>/dev/null; echo "0 3 * * 0 /opt/otp/refresh-gtfs.sh >> /var/log/otp-refresh.log 2>&1") | crontab -
```

## Cost summary

| Resource | Cost |
|---|---|
| Oracle Cloud ARM VM (4 CPU, 24GB) | $0/month forever |
| Cloudflare Workers | $0/month (free tier: 100k req/day) |
| Cloudflare KV | $0/month (free tier: 100k reads/day) |
| GTFS feeds | $0 (all public) |
| OTP routing | $0 (self-hosted) |
| **Total** | **$0/month** |

## Troubleshooting

**OTP won't start / OutOfMemoryError:**
Edit `/etc/systemd/system/otp.service` and reduce `-Xmx8G` to `-Xmx12G`
then `sudo systemctl daemon-reload && sudo systemctl restart otp`

**Graph build fails on a city:**
Delete that city's zip from `/opt/otp/graphs/default/` and rebuild.
OTP will route other cities fine without it.

**Port 8080 not reachable from Cloudflare:**
Oracle has two firewall layers — the Security List (cloud) AND iptables (OS).
Make sure you opened both (Step 3 covers both).
