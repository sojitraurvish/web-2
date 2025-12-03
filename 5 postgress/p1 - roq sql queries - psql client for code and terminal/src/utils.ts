import { Client } from 'pg';

export async function getClient() {
    const client = new Client("postgresql://neondb_owner:npg_RKC2PYZNV5My@ep-restless-mountain-a4fiw8de-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require");
    await client.connect();
    return client;
}

// if you want to perform the sql command via cli
// first instll pql client via terminal then writeh this command from above info
// psql -h ep-restless-mountain-a4fiw8de-pooler.us-east-1.aws.neon.tech -p 5432 -U neondb_owner -d neondb


// Other useful psql commands:
// \d - Lists all relations (tables, views, sequences)
// \d table_name - Shows structure of a specific table
// \l - Lists all databases
// \c database_name - Connect to a database
// \q - Quit psql