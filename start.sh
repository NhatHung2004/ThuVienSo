#!/bin/sh
echo "Running database migrations..."
flask db upgrade
echo "Starting gunicorn..."
gunicorn server/run.py -b 0.0.0.0:$PORT --timeout 120 --workers 1