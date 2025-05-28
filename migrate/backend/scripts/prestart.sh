#! /usr/bin/env bash

set -e
set -x

# Let the DB start
cd "$(dirname "$0")/.."  # Change to project root
PYTHONPATH=$PYTHONPATH:. python app/backend_pre_start.py

# Run migrations
alembic upgrade head

# Create initial data in DB
#python app/initial_data.py
