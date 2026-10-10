#!/usr/bin/env bash
# Verifica accesos autorizados y denegados contra la API en ejecución.
# Requisitos: app corriendo, seed cargado (db/scripts/inserts.sql), curl y python3.
# Uso: ./api-tests/verify-authorization.sh [http://localhost:3000]
BASE="${1:-http://localhost:3000}"
PASS=0; FAIL=0

login() {
    curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' \
        -d "{\"email\":\"$1\",\"password\":\"$2\"}" |
        python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))"
}

# check "<descripción>" <código esperado> <token> <método> <ruta> [body]
check() {
    local desc="$1" expected="$2" token="$3" method="$4" path="$5" body="$6" code
    local args=(-s -o /tmp/verify_body.json -w '%{http_code}' -X "$method" "$BASE$path" -H 'Content-Type: application/json')
    [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
    [ -n "$body" ] && args+=(-d "$body")
    code=$(curl "${args[@]}")
    if [ "$code" = "$expected" ]; then PASS=$((PASS + 1)); printf 'PASS  %-58s %s\n' "$desc" "$code"
    else FAIL=$((FAIL + 1)); printf 'FAIL  %-58s esperado %s, obtuvo %s\n' "$desc" "$expected" "$code"; fi
}

ADMIN=$(login admin@gym.com 'Admin123*')
USER=$(login juan@example.com 'User123*')
[ -z "$ADMIN" ] || [ -z "$USER" ] && { echo "No se pudo iniciar sesión. ¿Está cargado el seed?"; exit 1; }

echo "== Accesos denegados =="
check "Sin token: GET /exercises"                      401 ""     GET    /exercises
check "user: GET /users (manage_users)"                403 "$USER" GET    /users
check "user: GET /roles (manage_roles)"                403 "$USER" GET    /roles
check "user: GET /permissions (manage_roles)"          403 "$USER" GET    /permissions
check "user: POST /role-permissions (manage_roles)"    403 "$USER" POST   /role-permissions '{"roleId":2,"permissionId":7}'
check "user: POST /exercises (manage_exercises)"       403 "$USER" POST   /exercises '{"name":"X","type":"core"}'
check "user: DELETE /exercises/1 (manage_exercises)"   403 "$USER" DELETE /exercises/1

echo "== Accesos permitidos (user) =="
check "user: GET /exercises (read_exercise)"           200 "$USER" GET    /exercises
check "user: GET /routines (read_routine)"             200 "$USER" GET    /routines
check "user: GET /activity-logs (read_activity)"       200 "$USER" GET    /activity-logs
check "user: POST /routines (create_routine)"          201 "$USER" POST   /routines '{"userId":2,"name":"Verificación"}'
RID=$(python3 -c "import json; print(json.load(open('/tmp/verify_body.json')).get('id',''))")
check "user: PATCH /routines/$RID (update_routine)"    200 "$USER" PATCH  "/routines/$RID" '{"name":"Verificación 2"}'
check "user: DELETE /routines/$RID (delete_routine)"   204 "$USER" DELETE "/routines/$RID"

echo "== Accesos permitidos (admin) =="
check "admin: GET /users (manage_users)"               200 "$ADMIN" GET   /users
check "admin: GET /roles (manage_roles)"               200 "$ADMIN" GET   /roles
check "admin: GET /permissions (manage_roles)"         200 "$ADMIN" GET   /permissions
check "admin: GET /role-permissions (manage_roles)"    200 "$ADMIN" GET   /role-permissions
check "admin: POST /exercises (manage_exercises)"      201 "$ADMIN" POST  /exercises '{"name":"Verificación","type":"core"}'
EID=$(python3 -c "import json; print(json.load(open('/tmp/verify_body.json')).get('id',''))")
check "admin: DELETE /exercises/$EID"                  204 "$ADMIN" DELETE "/exercises/$EID"

echo; echo "Resultado: $PASS correctas, $FAIL fallidas"
[ "$FAIL" -eq 0 ]
