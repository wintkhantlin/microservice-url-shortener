#!/bin/bash
set -e

# Create the replication user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER replicator WITH REPLICATION PASSWORD 'repl_password';
    SELECT * FROM pg_create_physical_replication_slot('replica_slot');
EOSQL

# Append replication configuration to pg_hba.conf
# In Alpine, PGDATA is typically /var/lib/postgresql/18/data or similar, but the tool uses $PGDATA env var
echo "host replication replicator 0.0.0.0/0 trust" >> "$PGDATA/pg_hba.conf"
