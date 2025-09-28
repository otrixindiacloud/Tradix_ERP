#!/usr/bin/env bash
set -euo pipefail

API_BASE="http://localhost:${PORT:-5000}/api/auth"

echo "== Auth Test =="
echo "1. Register user (or detect existing)"
REG=$(curl -s -o /dev/stderr -w '%{http_code}' -X POST "$API_BASE/register" -H 'Content-Type: application/json' -d '{"username":"tester","password":"Passw0rd!"}')
if [[ "$REG" == "201" ]]; then
	echo "Registered new user."
else
	echo "Registration returned status $REG (likely exists), proceeding to login."
fi

echo "2. Login user (capture cookie)"
COOKIES=$(mktemp)
LOGIN=$(curl -i -s -c "$COOKIES" -b "$COOKIES" -X POST "$API_BASE/login" -H 'Content-Type: application/json' -d '{"username":"tester","password":"Passw0rd!"}')
echo "$LOGIN" | grep -q '200 OK' || { echo "Login failed: $LOGIN"; exit 1; }

echo "3. /me endpoint"
ME=$(curl -s -c "$COOKIES" -b "$COOKIES" "$API_BASE/me")
echo "$ME" | grep -q 'tester' || { echo "/me failed: $ME"; exit 1; }

echo "4. secure-check"
SEC=$(curl -s -c "$COOKIES" -b "$COOKIES" "$API_BASE/secure-check")
echo "$SEC" | grep -q 'Access granted' || { echo "secure-check failed: $SEC"; exit 1; }

echo "5. Logout"
OUT=$(curl -s -X POST -c "$COOKIES" -b "$COOKIES" "$API_BASE/logout")
echo "$OUT" | grep -q 'Logged out' || { echo "Logout failed: $OUT"; exit 1; }

echo "SUCCESS: Auth flow working." 