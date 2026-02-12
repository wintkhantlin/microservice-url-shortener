import pg from 'pg';

if (!process.env.REPLICA_DATABASE_URL) {
  throw new Error("REPLICA_DATABASE_URL is not set");
}

const pool = new pg.Pool({
  connectionString: process.env.REPLICA_DATABASE_URL,
});

export default pool;
