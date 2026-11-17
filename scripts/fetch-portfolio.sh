#!/bin/sh
# Downloads the portfolio pieces linked from the VisualCV resume into
# .portfolio-src/ (git-ignored), then renders them into public/portfolio/
# with scripts/render-portfolio.sh. Run from anywhere on macOS:
#   sh scripts/fetch-portfolio.sh
set -e

BASE="https://assets.visualcv.com/assets"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/.portfolio-src"
mkdir -p "$SRC"

for asset in \
  3661324/SmartRent.pdf \
  2227950/Screen_Shot_2018-12-03_at_1.10.14_PM.png \
  2227959/Screen_Shot_2018-12-03_at_1.21.08_PM.png \
  2227974/Screen_Shot_2018-12-03_at_1.29.32_PM.png \
  1268540/Portfolio_Mobile.jpg \
  1274355/Website_Redesign_Light.pdf \
  1274403/Before_and_After_Redesign.pdf \
  3160044/CRM_Before___After_Redesign.pdf; do
  curl -fsSL -o "$SRC/$(basename "$asset")" "$BASE/$asset"
  echo "downloaded $(basename "$asset")"
done

sh "$ROOT/scripts/render-portfolio.sh"
