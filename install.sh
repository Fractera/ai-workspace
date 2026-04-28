#!/bin/bash
set -e

REPO="https://github.com/Fractera/ai-workspace.git"
DIR="ai-workspace"

echo ""
echo "  Fractera AI Workspace — installer"
echo "  ──────────────────────────────────"
echo ""

# ── Node.js check ──────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  echo "  Node.js is not installed."
  echo "  Please download and install it from https://nodejs.org"
  echo "  Choose version 20 or higher, then run this command again."
  echo ""
  exit 1
fi

NODE_VER=$(node -e "process.exit(parseInt(process.version.slice(1)) < 20 ? 1 : 0)" 2>/dev/null && echo "ok" || echo "old")
if [ "$NODE_VER" = "old" ]; then
  echo "  Node.js is installed but the version is too old."
  echo "  Please install version 20 or higher from https://nodejs.org"
  echo ""
  exit 1
fi

echo "  Node.js $(node --version) — ok"

# ── Clone ──────────────────────────────────────────────────────────────────────
if [ -d "$DIR" ]; then
  echo "  Folder '$DIR' already exists — updating..."
  cd "$DIR"
  git pull --quiet
else
  echo "  Downloading Fractera..."
  git clone --quiet "$REPO" "$DIR"
  cd "$DIR"
fi

# ── Install dependencies ───────────────────────────────────────────────────────
echo "  Installing dependencies..."
npm install --prefix app --silent
npm install --prefix bridges/platforms --silent
npm install --prefix services/media --silent

# ── Launch ─────────────────────────────────────────────────────────────────────
echo ""
echo "  ──────────────────────────────────"
echo "  Fractera is ready."
echo "  Opening http://localhost:3000"
echo "  ──────────────────────────────────"
echo ""
echo "  Register your first account — it becomes the Administrator."
echo "  Press Ctrl+C at any time to stop."
echo ""

# Open browser
if command -v open &>/dev/null; then
  sleep 3 && open "http://localhost:3000" &
elif command -v xdg-open &>/dev/null; then
  sleep 3 && xdg-open "http://localhost:3000" &
elif command -v start &>/dev/null; then
  sleep 3 && start "http://localhost:3000" &
fi

npm run dev
