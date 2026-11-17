#!/bin/sh
# Downloads a logo for each company into public/logos/<job id>.png using
# Google's public favicon service. A company with no logo found is skipped,
# and its map pin keeps showing the monogram letter. Run on macOS:
#   sh scripts/fetch-logos.sh
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/logos"
mkdir -p "$OUT"

# <job id in experience.ts> <company domain>
# Commissions.io is left out on purpose: its old domain now serves another
# company's icon, so that pin keeps its "C" monogram. Infosys is left out too:
# its favicon is a cropped "Info" wordmark that reads as broken at pin size.
while read -r id domain; do
  [ -z "$id" ] && continue
  if curl -fsSL -o "$OUT/$id.png" "https://www.google.com/s2/favicons?domain=$domain&sz=128"; then
    echo "saved   $id ($domain)"
  else
    rm -f "$OUT/$id.png"
    echo "skipped $id ($domain): no logo found, pin keeps its letter"
  fi
done <<EOF
smartrent      smartrent.com
elm-street     elmstreet.com
epicpay        epicpay.com
razorthink     razorthink.com
neolife        neolife.com
zeality        zeality.com
apple          apple.com
infosys-amex   americanexpress.com
EOF
