#!/usr/bin/env bash
#
# Pull-based web deploy — run ON the VPS inside the voidinkstudio checkout:
#   cd /var/www/voidink_frontend/voidinkstudio && ./deploy-web.sh
#   # nginx serves https://voidinkstudios.com from this checkout's dist/
#
# Backend URL is env-selected via this checkout's .env (gitignored, VPS-only):
#   VITE_API_URL=https://api.voidink.studio
#   VITE_FORM_USE_API=true
#   VITE_GOOGLE_SHEETS_URL=...   # optional fallback / dual-write
#
# Mirrors Phonicly Dev-Frontend/deploy-web.sh (git pull -> build -> atomic swap).
# Build goes to dist.new; live dist is swapped only on success.
set -euo pipefail
cd "$(dirname "$0")"

BRANCH="${BRANCH:-main}"
echo "==> Pulling origin/$BRANCH"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"          # .env and dist/ are gitignored -> preserved

# Install deps only when the lockfile actually changed (code-only deploys stay fast).
LOCKHASH="$(sha1sum package-lock.json | cut -d' ' -f1)"
MARKER="node_modules/.deploy-lockhash"
if [ ! -d node_modules ] || [ ! -f "$MARKER" ] || [ "$(cat "$MARKER" 2>/dev/null)" != "$LOCKHASH" ]; then
  echo "==> Lockfile changed (or first run): npm ci"
  npm ci --no-audit --no-fund
  echo "$LOCKHASH" > "$MARKER"
else
  echo "==> Deps unchanged; skipping npm ci"
fi

echo "==> Building (dist.new)"
rm -rf dist.new
NODE_OPTIONS=--max-old-space-size=2048 npm run build -- --outDir dist.new --emptyOutDir

[ -f dist.new/index.html ] || { echo "BUILD FAILED: dist.new/index.html missing; live dist untouched"; exit 1; }

OWNER="$(stat -c %U:%G dist 2>/dev/null || echo www-data:www-data)"
TS="$(date +%Y%m%d-%H%M%S)"
if [ -d dist ]; then
  tar -czf "../dist-backup-$TS.tgz" -C dist . && echo "==> Backed up current dist -> ../dist-backup-$TS.tgz"
fi
rm -rf dist.old
[ -d dist ] && mv dist dist.old
mv dist.new dist
chown -R "$OWNER" dist
echo "==> Swapped in new dist (owner $OWNER). nginx serves immediately."
echo "==> Asset: $(grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' dist/index.html | head -1)"
echo "==> deploy-web OK @ $(git rev-parse --short HEAD)"
