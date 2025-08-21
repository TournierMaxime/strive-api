#!/bin/sh
set -eu

GARMIN_DIR="/var/app/garmin"
cd "$GARMIN_DIR"

# 1) venv
if [ ! -x .venv/bin/python3 ]; then
  python3 -m venv .venv
fi
.venv/bin/python3 -m pip install --upgrade pip setuptools wheel

# 2) installe/upgrade GarminDb à chaque run (idempotent)
.venv/bin/python3 -m pip install --upgrade garmindb

# 3) trouve le script CLI installé par pip
CLI="$GARMIN_DIR/.venv/bin/garmindb_cli.py"
if [ ! -f "$CLI" ]; then
  # certains environnements l’installent sans extension, on tente l’autre nom
  [ -f "$GARMIN_DIR/.venv/bin/garmindb_cli" ] && CLI="$GARMIN_DIR/.venv/bin/garmindb_cli"
fi

if [ ! -f "$CLI" ] && ! command -v garmindb_cli.py >/dev/null 2>&1; then
  echo "❌ garmindb_cli(.py) introuvable dans le venv. Dump de .venv/bin :" >&2
  ls -la "$GARMIN_DIR/.venv/bin" >&2
  .venv/bin/python3 -m pip show garmindb >&2 || true
  exit 1
fi

# 4) exécute l’update **sans download** (import/analyze sur tes fichiers locaux)
#    -> ajoute --all si tu veux tout retraiter, sinon --latest pour l’incrémental
if [ -f "$CLI" ]; then
  exec .venv/bin/python3 "$CLI" --all --download --import --analyze --latest
else
  # fallback si le script est dans PATH (rare)
  exec .venv/bin/python3 "$(command -v garmindb_cli.py)" --all --download --import --analyze --latest
fi
