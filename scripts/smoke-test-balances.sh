#!/usr/bin/env bash
# Build + boot the production server and verify /balances returns real data (not an error).
set -uo pipefail

cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
SERVER_PID=""

cleanup() {
  [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null
  lsof -ti:"$PORT" | xargs -r kill -9
}
trap cleanup EXIT

echo "==> Clearing anything already on port $PORT"
lsof -ti:"$PORT" | xargs -r kill -9

echo "==> Building"
npm run build

echo "==> Starting server (npm start)"
npm start &
SERVER_PID=$!

echo "==> Waiting for /health"
for _ in $(seq 1 20); do
  curl -s -o /dev/null "http://localhost:${PORT}/health" && break
  sleep 0.5
done

echo "==> Requesting /balances"
RESPONSE=$(curl -s "http://localhost:${PORT}/balances")
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | jq -e '.error' >/dev/null 2>&1; then
  echo "FAIL: /balances returned an error"
  exit 1
fi

if ! echo "$RESPONSE" | jq -e '.balances | length > 0' >/dev/null 2>&1; then
  echo "FAIL: /balances did not return any balances"
  exit 1
fi

echo "PASS: /balances returned real data"
