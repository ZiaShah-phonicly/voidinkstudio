# VOIDINK web deploy (VPS) — Phonicly-style pull + build

Site: https://voidinkstudios.com  
Repo checkout on the VPS: `/var/www/frontend`  
Script: `./deploy-web.sh` (same shape as `Dev-Frontend/deploy-web.sh`)

This is **not** Docker. Static `dist/` is built on the box; host nginx serves it.
Backend API stays separate (`backend-voidink` Docker → `api.voidinkstudios.com`).

## One-time bootstrap

```bash
ssh root@YOUR_VPS_IP

# checkout (read-only deploy key recommended)
sudo git clone git@github.com:YOUR_ORG/voidinkstudio.git /var/www/frontend
cd /var/www/frontend
chmod +x deploy-web.sh

# VPS-only secrets / build env (gitignored — backup this file)
cat > .env <<'EOF'
VITE_API_URL=https://api.voidinkstudios.com
VITE_FORM_USE_API=true
VITE_GOOGLE_SHEETS_URL=
VITE_DISCORD_WEBHOOK_URL=
VITE_TUBES_THEME=voidink
VITE_LOCK_PAGE=true
EOF
# If API subdomain not ready yet: leave VITE_FORM_USE_API=false and set Sheets URL.

# nginx + TLS
sudo cp deploy/nginx.voidinkstudios.com.conf /etc/nginx/sites-available/voidinkstudios.com
sudo ln -sf /etc/nginx/sites-available/voidinkstudios.com /etc/nginx/sites-enabled/
# Point DNS A records for voidinkstudios.com + www at this VPS first, then:
sudo certbot --nginx -d voidinkstudios.com -d www.voidinkstudios.com
sudo nginx -t && sudo systemctl reload nginx

# first build
./deploy-web.sh
```

## Every deploy after that

```bash
ssh root@YOUR_VPS_IP
cd /var/www/frontend && ./deploy-web.sh
```

`deploy-web.sh`: `git reset --hard origin/main` → `npm ci` only if lockfile changed → build to `dist.new` → backup live → atomic swap → `chown`.

## Verify

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://voidinkstudios.com/
# 200; new asset hash in index.html:
curl -s https://voidinkstudios.com/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.js' | head -1
```

## Rollback

```bash
cd /var/www
# latest backup sits next to the checkout:
tar -xzf dist-backup-YYYYMMDD-HHMMSS.tgz -C frontend/dist
# or:
cd frontend && mv dist dist.bad && mv dist.old dist
```

## Order with backend

Deploy **web first**, then backend, when a change spans both (clients update before API tightens).
