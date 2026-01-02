https://projects.100xdevs.com/tracks/testing-2/Integration-and-End-to-End-testing-3

integraiton tests 
if you relly want that while testing your app you also test external services like db, kafka, redis all that then this is used


Integration tests
While unit tests are great, they mock out a lot of external services (DB, cache, message queues ...). This is great for testing the functionality of a function in isolation.
Integration tests are used to test how all integrated components work together.
This means you have to start all auxilary services before running your tests and you DONT mock out any external service calls
 
Downsides
1. Slower to execute
2. Add complexity
3. Local development setup if required for a developer (things like docker)



npm run test =>
1. starts postgres (using docker) 
2. checks postgres health
3. npx prisma migrate (create tables) 
4. npx prisma generate
5. describe => it

//integration steps - code in integration test folder
// step by step process

npm init -y
npx tsc --init

npm i express @types/express prisma
npx prisma init

npx prisma generate

tsc -b
node dist/bin.js


Starting the DB
Until now, we’ve used one of the following ways to start a DB

Start one on https://neon.tech/ / aieven
Start it locally using docker
docker run -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword  -d postgres


Let’s use the second one to start a database and then hit our backend
Make sure docker is running
Start a DB locally
docker run -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword  -d postgres

Update .env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"

Migrate the DB
npx prisma migrate dev --name <init or name>

Generate the client
npx prisma generate


Check the DB and ensure data is going in 
npx prisma studio

 
What we did right now is a manual integration test
We now need to automate this thing and do the same programatically
Let’s take down the database for now - 
docker ps
docker kill container_id


Bootstraping Integration tests in vitest
 
Add vitest as a dependency
npm i vitest

// why to use docker-compose if you if start it vai manual coomand in .sh script and if you run it twice or written that command twice then it would start twice in case of docker-compose that does not happen
Add a docker-compose with all your external services
version: '3.8'
services:
  db:
    image: postgres
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=mysecretpassword
    ports:
      - '5432:5432'



Crate src/tests/helpers/reset-db.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async () => {
  await prisma.$transaction([
    prisma.request.deleteMany(),
  ])
}

Create a new script scripts/run-integration.sh
docker-compose up -d

Bring in wait-for-it.sh locally in scripts/wait-for-it.sh
curl https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o scripts/wait-for-it.sh

💡
On a mac, you might need this to run the following command - 
brew install coreutils && alias timeout=gtimeout
Ref - https://github.com/vishnubob/wait-for-it/issues/108
Make the scripts executable
chmod +x scripts/*

Update run-integration.sh
docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
./wait-for-it.sh "postgresql://postgres:mysecretpassword@localhost:5432/postgres" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name init
npm run test
docker-compose down

Update package.json
"scripts": {
	"test": "vitest",
  "test:integration": "./scripts/run-integration.sh"
},



Adding integration tests
 
Install supertest
npm i -D supertest @types/supertest

Add src/tests/sum.test.ts
import { describe, expect, it } from "vitest";
import { app } from "..";
import request from "supertest";

describe("POST /sum", () => {
    it("should sum add 2 numbers", async () => {
        const { status, body } = await request(app).post('/sum').send({
            a: 1,
            b: 2
        })
        expect(status).toBe(200);
        expect(body).toEqual({ answer: 3, id: expect.any(Number) });
    });
})

Try running the tests
npm run test


beforeEach and beforeAll function
 
beforeEach
If you want to clear the DB between tests/descibe blocks, you can use the beforeEach function
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "..";
import request from "supertest";
import resetDb from "./helpers/reset-db";

describe("POST /sum", () => {
    beforeEach(async () => {
        console.log("clearing db");
        await resetDb();
    });

    it("should sum add 2 numbers", async () => {
        const { status, body } = await request(app).post('/sum').send({
            a: 1,
            b: 2
        })
        expect(status).toBe(200);
        expect(body).toEqual({ answer: 3, id: expect.any(Number) });
    });

    it("should sum add 2 negative numbers", async () => {
        const { status, body } = await request(app).post('/sum').send({
            a: -1,
            b: -2
        })
        expect(status).toBe(200);
        expect(body).toEqual({ answer: -3, id: expect.any(Number) });
    });
})


beforeAll
If you want certain code to run before all the tests (but not before every individual test), you can use the beforeAll function
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "..";
import request from "supertest";
import resetDb from "./helpers/reset-db";

describe("POST /sum", () => {
    beforeAll(async () => {
        console.log("clearing db");
        await resetDb();
    });

    it("should sum add 2 numbers", async () => {
        const { status, body } = await request(app).post('/sum').send({
            a: 1,
            b: 2
        })
        expect(status).toBe(200);
        expect(body).toEqual({ answer: 3, id: expect.any(Number) });
    });

    it("should sum add 2 negative numbers", async () => {
        const { status, body } = await request(app).post('/sum').send({
            a: -1,
            b: -2
        })
        expect(status).toBe(200);
        expect(body).toEqual({ answer: -3, id: expect.any(Number) });
    });
})



CI/CD pipeline
Final code - https://github.com/100xdevs-cohort-2/week-25-integ-e2e-tests
 
Add a .env.example
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"

Add .github/workflows/test.yml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Set up Docker Compose
      uses: docker/setup-qemu-action@v2

    - name: Ensure Docker Compose is available
      run: docker-compose version

    - name: Copy .env.example to .env
      run: cp ./1-integration-test/.env.example ./1-integration-test/.env

    - name: Run integration script
      run: cd 1-integration-test && npm run test:integration