#!/bin/sh
# Tries several public logo sources for one company and saves every result to
# .portfolio-src/logo-candidates/<id>/ (git-ignored) for review. Nothing is
# placed on the site; pick a candidate and copy it to public/logos/<id>.png.
#   sh scripts/fetch-logo-candidates.sh <job id> <domain>
#   sh scripts/fetch-logo-candidates.sh infosys infosys.com
set -u
id="$1"
domain="$2"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/.portfolio-src/logo-candidates/$id"
mkdir -p "$OUT"

try() { # <file name> <url>
  if curl -fsSL --max-time 15 -o "$OUT/$1" "$2"; then
    echo "saved   $1"
  else
    rm -f "$OUT/$1"
    echo "missing $1"
  fi
}

try google-256.png      "https://www.google.com/s2/favicons?domain=$domain&sz=256"
try duckduckgo.ico      "https://icons.duckduckgo.com/ip3/$domain.ico"
try icon-horse.png      "https://icon.horse/icon/$domain"
try apple-touch.png     "https://www.$domain/apple-touch-icon.png"
try favicon.ico         "https://www.$domain/favicon.ico"
echo "Candidates are in $OUT"
