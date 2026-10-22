#!/usr/bin/env bash
# Route checks for /sessions/[id] against a running production server.
#
#   npm run build
#   npm run start -- --hostname 127.0.0.1 --port 3001      # terminal 1
#   bash scripts/check-session-routes.sh                     # terminal 2
#   bash scripts/check-session-routes.sh http://127.0.0.1:3001   # or pass a base URL
#
# Every request is bounded (CONNECT_TIMEOUT / MAX_TIME, seconds), so a hanging
# server fails fast instead of stalling the run. Exit code is 0 only if every
# check passes.
set -u

BASE="${1:-${BASE_URL:-http://127.0.0.1:3001}}"
CONNECT_TIMEOUT="${CONNECT_TIMEOUT:-3}"
MAX_TIME="${MAX_TIME:-10}"

pass=0
fail=0
body="$(mktemp)"
trap 'rm -f "$body"' EXIT

# request PATH -> sets STATUS and TIME; STATUS "000" means no HTTP response
request() {
  local out
  out=$(curl -s -o "$body" --connect-timeout "$CONNECT_TIMEOUT" --max-time "$MAX_TIME" \
    -w '%{http_code} %{time_total}' "$BASE$1")
  STATUS="${out%% *}"
  TIME="${out##* }"
}

report() { # ok|FAIL status time path note
  printf '%-5s %s  %6.3fs  %-52s %s\n' "$1" "$2" "$3" "$4" "$5"
  if [ "$1" = "ok" ]; then pass=$((pass + 1)); else fail=$((fail + 1)); fi
}

# expect_status EXPECTED PATH [NOTE]; EXPECTED may list alternatives, e.g. "400|404"
expect_status() {
  request "$2"
  local note="${3:-}"
  if [ "$STATUS" = "000" ]; then
    report FAIL "$STATUS" "$TIME" "$2" "no response within ${MAX_TIME}s (timeout or connection reset)"
  elif [[ "|$1|" == *"|$STATUS|"* ]]; then
    report ok "$STATUS" "$TIME" "$2" "$note"
  else
    report FAIL "$STATUS" "$TIME" "$2" "expected $1 $note"
  fi
}

# expect_session ID: 200 and the page actually shows that session
expect_session() {
  request "/sessions/$1"
  if [ "$STATUS" = "200" ] && grep -q "$1" "$body"; then
    report ok "$STATUS" "$TIME" "/sessions/$1" "known session"
  elif [ "$STATUS" = "000" ]; then
    report FAIL "$STATUS" "$TIME" "/sessions/$1" "no response within ${MAX_TIME}s"
  else
    report FAIL "$STATUS" "$TIME" "/sessions/$1" "expected 200 with session content"
  fi
}

echo "Base URL: $BASE   (connect timeout ${CONNECT_TIMEOUT}s, max ${MAX_TIME}s per request)"
echo

echo "Known mock sessions -> 200"
expect_session c0a8e1f2b3d4
expect_session 7f3b9d21a6e0
expect_session e41d0c7a95b8
echo

echo "Unknown IDs -> real 404"
expect_status 404 /sessions/000000000000 "unknown id"
expect_status 404 /sessions/does-not-exist "unknown id"
expect_status 404 /sessions/C0A8E1F2B3D4 "wrong case of a known id"
expect_status 404 /sessions/7F3B9D21A6E0 "wrong case of a known id"
expect_status 404 /sessions/E41D0C7A95B8 "wrong case of a known id"
expect_status 404 /sessions/c0A8e1F2b3D4 "mixed case of a known id"
expect_status 404 /sessions/c0a8e1f2b3d4%20 "known id + trailing space"
expect_status 404 '/sessions/%3Cscript%3Ealert(1)%3C%2Fscript%3E' "markup in id"
expect_status 404 /sessions/not-found "former rewrite target, visited directly"
expect_status 404 /sessions/000000000000 "repeat request (cached result stays 404)"
echo

echo "Malformed percent-encoding -> rejected with 400 or 404, never 5xx"
expect_status "400|404" '/sessions/%E0%A4%A' "truncated UTF-8 sequence"
expect_status "400|404" '/sessions/%ZZ' "invalid escape"
expect_status "400|404" '/sessions/%' "bare percent sign"
echo

echo "Known sessions again, after the bad requests -> still 200 with their own content"
echo "(guards against a case variant overwriting a cached page on case-insensitive disks)"
expect_session c0a8e1f2b3d4
expect_session 7f3b9d21a6e0
expect_session e41d0c7a95b8
echo

echo "Result: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
