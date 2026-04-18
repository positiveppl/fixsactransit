#!/bin/bash
# ── fixsactransit OTP Setup ───────────────────────────────────────────────────
# Run this on a fresh Oracle Cloud Free Tier ARM VM (Ubuntu 22.04)
# Oracle Free Tier: 4 ARM CPUs, 24GB RAM, 200GB storage — forever free
#
# Usage:
#   ssh ubuntu@YOUR_ORACLE_IP
#   curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/otp/setup.sh | bash

set -e

OTP_VERSION="2.5.0"
OTP_JAR="otp-${OTP_VERSION}-shaded.jar"
OTP_DIR="/opt/otp"
DATA_DIR="/opt/otp/data"
GRAPHS_DIR="/opt/otp/graphs/default"

echo "────────────────────────────────────────"
echo "  fixsactransit — OTP Setup"
echo "  OpenTripPlanner ${OTP_VERSION}"
echo "────────────────────────────────────────"

# ── 1. System deps ────────────────────────────────────────────────────────────
echo "[1/7] Installing Java 17..."
sudo apt-get update -qq
sudo apt-get install -y -qq openjdk-17-jre-headless curl wget unzip

java -version

# ── 2. Create directories ─────────────────────────────────────────────────────
echo "[2/7] Creating directories..."
sudo mkdir -p "$OTP_DIR" "$DATA_DIR" "$GRAPHS_DIR"
sudo chown -R ubuntu:ubuntu "$OTP_DIR"

# ── 3. Download OTP jar ───────────────────────────────────────────────────────
echo "[3/7] Downloading OpenTripPlanner ${OTP_VERSION}..."
if [ ! -f "${OTP_DIR}/${OTP_JAR}" ]; then
  wget -q --show-progress \
    "https://github.com/opentripplanner/OpenTripPlanner/releases/download/v${OTP_VERSION}/${OTP_JAR}" \
    -O "${OTP_DIR}/${OTP_JAR}"
  echo "  ✓ OTP jar downloaded"
else
  echo "  ✓ OTP jar already present"
fi

# ── 4. Download all GTFS feeds ────────────────────────────────────────────────
echo "[4/7] Downloading GTFS feeds for all 12 cities..."

download_gtfs() {
  local name=$1
  local url=$2
  local outfile="${DATA_DIR}/${name}-gtfs.zip"

  if [ -f "$outfile" ]; then
    echo "  ✓ ${name} (cached)"
    return
  fi

  echo "  ↓ ${name}..."
  if wget -q --show-progress \
    --user-agent="fixsactransit.org/1.0 (civic data project)" \
    -O "$outfile" "$url"; then
    echo "  ✓ ${name}"
  else
    echo "  ✗ ${name} FAILED — skipping (won't affect other cities)"
    rm -f "$outfile"
  fi
}

# All feeds are public — no auth required for static GTFS
download_gtfs "new_york"      "http://web.mta.info/developers/data/nyct/subway/google_transit.zip"
download_gtfs "chicago"       "https://www.transitchicago.com/downloads/sch_data/google_transit.zip"
download_gtfs "washington_dc" "https://gtfs.wmata.com/gtfs/google_transit.zip"
download_gtfs "san_francisco" "https://gtfs.sfmta.com/transitdata/google_transit.zip"
download_gtfs "seattle"       "https://metro.kingcounty.gov/GTFS/google_transit.zip"
download_gtfs "los_angeles"   "https://gtfs.metro.net/agencies/lax/subdir/google_transit.zip"
download_gtfs "portland"      "https://developer.trimet.org/schedule/gtfs.zip"
download_gtfs "denver"        "https://www.rtd-denver.com/files/gtfs/google_transit.zip"
download_gtfs "minneapolis"   "https://svc.metrotransit.org/mtgtfs/gtfs.zip"
download_gtfs "phoenix"       "https://www.valleymetro.org/sites/default/files/uploads/gtfs-files/google_transit.zip"
download_gtfs "san_jose"      "https://www.vta.org/sites/default/files/2021-07/VTA_GTFS_July2021.zip"
download_gtfs "sacramento"    "https://www.sacrt.com/googletransit/googlegtfs.zip"

echo "  GTFS downloads complete"
ls -lh "${DATA_DIR}"/*.zip 2>/dev/null | awk '{print "  ", $5, $9}'

# ── 5. Copy feeds to OTP graph directory ─────────────────────────────────────
echo "[5/7] Staging feeds for OTP graph build..."
cp "${DATA_DIR}"/*.zip "$GRAPHS_DIR/" 2>/dev/null || true
echo "  ✓ Feeds staged in ${GRAPHS_DIR}"

# ── 6. Write OTP config ───────────────────────────────────────────────────────
echo "[6/7] Writing OTP configuration..."

cat > "${GRAPHS_DIR}/build-config.json" << 'EOF'
{
  "transitServiceStart": "-P1Y",
  "transitServiceEnd": "P3Y",
  "maxStopToShapeSnapDistance": 500,
  "distanceBetweenElevationSamples": 50,
  "osmWayPropertySet": "default",
  "islandWithoutStopsMaxSize": 5,
  "islandWithStopsMaxSize": 5
}
EOF

cat > "${GRAPHS_DIR}/router-config.json" << 'EOF'
{
  "routingDefaults": {
    "numItineraries": 3,
    "maxWalkDistance": 1500,
    "walkSpeed": 1.33,
    "transferSlack": 120,
    "waitAtBeginningFactor": 0.4
  },
  "updaters": []
}
EOF

cat > "${OTP_DIR}/otp.yaml" << 'EOF'
server:
  port: 8080
  bindAddress: "0.0.0.0"

otp:
  dataImportReport: true
EOF

echo "  ✓ Config files written"

# ── 7. Build graph + create systemd service ───────────────────────────────────
echo "[7/7] Building OTP graph (this takes 5–15 minutes)..."
echo "  Loading all 12 city GTFS feeds into a single router..."

cd "$OTP_DIR"
java -Xmx18G -jar "${OTP_JAR}" \
  --build --save \
  "$GRAPHS_DIR"

echo "  ✓ Graph built → ${GRAPHS_DIR}/graph.obj"

# ── Create systemd service ────────────────────────────────────────────────────
echo "Creating systemd service..."

sudo tee /etc/systemd/system/otp.service > /dev/null << EOF
[Unit]
Description=OpenTripPlanner — fixsactransit.org
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=${OTP_DIR}
ExecStart=/usr/bin/java -Xmx8G -jar ${OTP_DIR}/${OTP_JAR} --load ${GRAPHS_DIR}
Restart=always
RestartSec=30
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable otp
sudo systemctl start otp

echo ""
echo "────────────────────────────────────────"
echo "  ✓ OTP is starting up"
echo ""
echo "  Check status:  sudo systemctl status otp"
echo "  Watch logs:    sudo journalctl -u otp -f"
echo ""
echo "  OTP will be ready in ~5 minutes at:"
echo "  http://$(curl -s ifconfig.me):8080"
echo ""
echo "  Test it:"
echo "  curl 'http://localhost:8080/otp/routers/default/index/feeds'"
echo "────────────────────────────────────────"
