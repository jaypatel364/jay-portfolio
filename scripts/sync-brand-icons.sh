#!/usr/bin/env bash
# Regenerate favicon / Apple / PWA icons from the square avatar.
# Usage: ./scripts/sync-brand-icons.sh [path-to-avatar.png]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/public/images/avatar.png}"

if [[ ! -f "$SRC" ]]; then
  echo "Missing source image: $SRC" >&2
  exit 1
fi

mkdir -p "$ROOT/public/icons" /tmp/jay-favicon

sips -z 16 16 "$SRC" --out "$ROOT/public/icons/icon-16.png" >/dev/null
sips -z 32 32 "$SRC" --out "$ROOT/public/icons/icon-32.png" >/dev/null
sips -z 180 180 "$SRC" --out "$ROOT/public/icons/apple-touch-icon.png" >/dev/null
cp "$ROOT/public/icons/apple-touch-icon.png" "$ROOT/app/apple-icon.png"
sips -z 192 192 "$SRC" --out "$ROOT/public/icons/icon-192.png" >/dev/null
cp "$SRC" "$ROOT/public/icons/icon-512.png"

for size in 16 32 48; do
  sips -z "$size" "$size" "$SRC" --out "/tmp/jay-favicon/$size.png" >/dev/null
done

python3 - "$ROOT" << 'PY'
import struct
import sys
from pathlib import Path

root = Path(sys.argv[1])
sizes = [16, 32, 48]
images = [Path(f"/tmp/jay-favicon/{s}.png").read_bytes() for s in sizes]
offset = 6 + 16 * len(images)
entries = b""
payload = b""
for png, size in zip(images, sizes):
    entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png), offset)
    payload += png
    offset += len(png)
(root / "app" / "favicon.ico").write_bytes(struct.pack("<HHH", 0, 1, len(images)) + entries + payload)
PY

rm -f "$ROOT/app/icon.png"

echo "Synced icons from $(basename "$SRC")"
