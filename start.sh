#!/bin/sh
export FLASK_APP=server/run.py
echo "Running database migrations..."
python -m flask db upgrade
echo "Starting gunicorn..."
python -m gunicorn server.run:app -b 0.0.0.0:$PORT --timeout 120 --workers 1
