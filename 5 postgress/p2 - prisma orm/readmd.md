npm  i -D typescript ts-node @types/node 
npx tsc --init

# Prisma CLI (global or local)
npm install -D prisma  # local installation (recommended)

# Prisma Client
// to use presma client and once you run the migration commad new user chainges get written in this client and it halps to perform db oprations
npm install @prisma/client

------------------------------------------------
Install the packages needed for this quickstart:

npm install prisma @types/node @types/pg --save-dev 
npm install @prisma/client @prisma/adapter-pg pg dotenv

Here's what each package does:

prisma - The Prisma CLI for running commands like prisma init, prisma migrate, and prisma generate
@prisma/client - The Prisma Client library for querying your database
@prisma/adapter-pg - The node-postgres driver adapter that connects Prisma Client to your database
pg - The node-postgres database driver
@types/pg - TypeScript type definitions for node-postgres
dotenv - Loads environment variables from your .env file
------------------------------------------------


// only run bello thing if necessory otherwise your client also get updated when you genearate your migration
// and whenever you change something schma and and migrate you also have to regenerate client to get new change to prisma client
npx prisma generate

 // to initail prisma in your project
npx prisma init --datasource-provider postgresql 
// for mongodb
npx prisma init --datasource-provider mongodb 

// now first define your db schema, i mean tables
// then inorder to create those tables in our database we have to migrate it and to migrate it 
// npx prisma migrate dev --name init

// to delete all the migrations 
// rm -r prisma/migrations
// if you remove the migration locally the you should also need to remove that from your actual db and to do that use bello commad

Solution 1: Reset the Database (Recommended for Development)
If you don't need the existing data, reset the database:
npx prisma migrate reset
This will:
Drop all tables in your Neon database.
Create a fresh migration history.
Apply the current schema from schema.prisma.

Solution 2: Recreate Missing Migration (If You Need to Keep Data)
If you want to preserve the existing data:
1) Baseline your database (tell Prisma to accept the current state as valid):
npx prisma migrate resolve --applied "20250725155404_init"
2)Then create a new migration:
npx prisma migrate dev --name init

Solution 3: Manually Sync Schema
Pull the current schema from Neon:
npx prisma db pull
Generate a new migration based on differences:
npx prisma migrate dev --name sync_with_prod


// to open presma compass as like mongodb
npx prisma studio


