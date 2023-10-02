#!/bin/sh
set -e

# Wait for the database to be available
until nc -z -v -w30 db 5432
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

CONN_STR=$ConnectionStrings__ShoppingApp
HOST=$(echo $CONN_STR | sed -n -e 's/^.*Host=\([^;]*\).*$/\1/p')
DB=$(echo $CONN_STR | sed -n -e 's/^.*Database=\([^;]*\).*$/\1/p')
USER=$(echo $CONN_STR | sed -n -e 's/^.*Username=\([^;]*\).*$/\1/p')
PASS=$(echo $CONN_STR | sed -n -e 's/^.*Password=\([^;]*\).*$/\1/p')

if [ ! -f /app/migrations_applied ]; then
	echo "Applying database migrations..."
	export PGPASSWORD=$PASS
	psql -h $HOST -U $USER -d $DB -f migrations.sql
	touch /app/migrations_applied
	# Unset password variable immediately after use
	unset PGPASSWORD
fi

echo "Starting the application..."
# Start the application
exec dotnet web.dll