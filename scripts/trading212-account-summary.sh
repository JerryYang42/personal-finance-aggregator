#!/usr/bin/env bash
# Fetch Trading212 ISA account summary using Basic Auth built from .env credentials.
set -euo pipefail

cd "$(dirname "$0")/.."
set -a; source .env; set +a

AUTH1=$(printf '%s' "${TRADING212_STOCKS_ISA_API_KEY}:${TRADING212_STOCKS_ISA_SECRET_KEY}" | base64)
curl -s -o /tmp/isa2.json -w "STATUS=%{http_code}\n" https://live.trading212.com/api/v0/equity/account/summary -H "Authorization: Basic $AUTH1"
cat /tmp/isa2.json; echo
