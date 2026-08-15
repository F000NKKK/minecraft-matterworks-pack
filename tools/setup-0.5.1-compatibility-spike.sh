#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

branch="$(git branch --show-current)"
if [[ "$branch" != "feature/0.5.1-alchemistry-progression" ]]; then
  echo "Expected branch feature/0.5.1-alchemistry-progression, got: $branch" >&2
  exit 1
fi

command -v packwiz >/dev/null 2>&1 || {
  echo "packwiz is required on PATH" >&2
  exit 1
}

echo "[Matterworks] Adding PneumaticCraft: Repressurized 6.0.23"
packwiz mr add pneumaticcraft-repressurized \
  --version-id ohRZqkHb \
  --yes

echo "[Matterworks] Adding Compressed Creativity 1.20.1-0.2.0"
packwiz mr add compressedcreativity \
  --version-id Y54tJ85z \
  --yes

echo "[Matterworks] Adding NuclearCraft: Neoteric 1.20.1-1.2.34"
packwiz cf add nuclearcraft-neoteric \
  --addon-id 840010 \
  --file-id 8581060 \
  --yes

echo "[Matterworks] Refreshing pack index"
packwiz refresh

echo
printf '%s\n' \
  "Compatibility spike metadata added." \
  "Do not merge yet: perform a full client restart and runtime smoke test first."
