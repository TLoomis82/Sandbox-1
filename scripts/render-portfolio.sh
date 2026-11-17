#!/bin/sh
# Turns the files in .portfolio-src/ into web-sized JPEGs in public/portfolio/.
# PDFs render one chosen page (see PAGE_* below) with margins trimmed.
# Works offline; run after fetch-portfolio.sh has downloaded the sources.
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/.portfolio-src"
OUT="$ROOT/public/portfolio"
WORK="$(mktemp -d)"
mkdir -p "$OUT"

# Which PDF page to use for each piece (1-based). "a+b" puts two pages side by
# side as Before / After. Chosen to match the VisualCV portfolio thumbnails.
PAGE_SMARTRENT=2
PAGE_BACK_OFFICE=3
PAGE_BEFORE_AFTER=1+2
# The CRM "after" page is very tall, so a side-by-side shrinks it to a sliver;
# use it alone (it is also the VisualCV thumbnail).
PAGE_CRM=2

jpeg() { # <source image> <output name>
  w=$(sips -g pixelWidth "$1" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$1" | awk '/pixelHeight/{print $2}')
  if [ "$h" -gt $((w * 2)) ]; then
    # Long scrolling pages: cap the width instead, so text stays readable.
    width=$((w < 1200 ? w : 1200))
    sips -s format jpeg -s formatOptions 80 --resampleWidth "$width" "$1" --out "$OUT/$2" >/dev/null
  else
    sips -s format jpeg -s formatOptions 82 -Z 1800 "$1" --out "$OUT/$2" >/dev/null
  fi
  echo "saved $2"
}

pdf() { # <source pdf> <page> <output name>
  swift "$ROOT/scripts/pdfpage.swift" "$SRC/$1" "$2" "$WORK/page.png" >/dev/null
  jpeg "$WORK/page.png" "$3"
}

pdf SmartRent.pdf                   $PAGE_SMARTRENT   smartrent-dashboard.jpg
pdf SmartRent.pdf                   1                 smartrent-shop.jpg
pdf SmartRent.pdf                   3                 smartrent-access-code.jpg
pdf SmartRent.pdf                   4                 smartrent-amenities.jpg
jpeg "$SRC/Screen_Shot_2018-12-03_at_1.29.32_PM.png"  commissions-balsamiq.jpg
jpeg "$SRC/Screen_Shot_2018-12-03_at_1.10.14_PM.png"  commissions-sketch.jpg
jpeg "$SRC/Screen_Shot_2018-12-03_at_1.21.08_PM.png"  commissions-hifi.jpg
jpeg "$SRC/Portfolio_Mobile.jpg"                       neolife-club-app.jpg
pdf Website_Redesign_Light.pdf      $PAGE_BACK_OFFICE  neolife-back-office.jpg
# Extra pages for the Shop Redesign gallery (page 3 above is its cover).
pdf Website_Redesign_Light.pdf      2                  neolife-shop-p2.jpg
pdf Website_Redesign_Light.pdf      4                  neolife-shop-p4.jpg
pdf Website_Redesign_Light.pdf      5                  neolife-shop-p5.jpg
pdf Before_and_After_Redesign.pdf   $PAGE_BEFORE_AFTER neolife-before-after.jpg
# Back office case study gallery: pages 1/2 are the home before/after,
# pages 3/4 the product page before/after.
pdf Before_and_After_Redesign.pdf   3+4               neolife-product-before-after.jpg
pdf Before_and_After_Redesign.pdf   1                 neolife-home-before.jpg
pdf Before_and_After_Redesign.pdf   2                 neolife-home-after.jpg
pdf Before_and_After_Redesign.pdf   3                 neolife-product-before.jpg
pdf Before_and_After_Redesign.pdf   4                 neolife-product-after.jpg
pdf CRM_Before___After_Redesign.pdf $PAGE_CRM          elm-crm-redesign.jpg
# CRM case study gallery: odd pages are befores, even pages the afters.
pdf CRM_Before___After_Redesign.pdf 1                 elm-crm-dashboard-before.jpg
pdf CRM_Before___After_Redesign.pdf 3                 elm-crm-listings-before.jpg
pdf CRM_Before___After_Redesign.pdf 4                 elm-crm-listings-after.jpg
pdf CRM_Before___After_Redesign.pdf 5                 elm-crm-property-before.jpg
pdf CRM_Before___After_Redesign.pdf 6                 elm-crm-property-after.jpg

# The CRM "before" screens show real agents' names, a client brokerage, and
# listing agents' phone numbers and emails. Blur them. Rects are x,y,w,h in
# pixels of each rendered JPEG; re-check them if a page's size changes.
redact() { # <output name> <x,y,w,h>...
  file="$1"
  shift
  swift "$ROOT/scripts/redact.swift" "$OUT/$file" "$@" >/dev/null
  echo "redacted $file"
}
redact elm-crm-dashboard-before.jpg 1575,25,190,58  0,622,242,58
redact elm-crm-listings-before.jpg  1598,28,200,58  0,632,252,60
redact elm-crm-property-before.jpg  1560,28,240,62  1272,645,340,480

rm -rf "$WORK"
