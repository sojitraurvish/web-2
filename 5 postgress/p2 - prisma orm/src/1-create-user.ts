import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, log: ['info','query'] })

// const prisma = new PrismaClient({
//     adapter,
//     log: [
//       {
//         emit: "event",
//         level: "query",
//       },
//     ],
//   })


async function main() {
    const user = await prisma.user.create({
        data: {
            email: "test7@test.com", 
            name: "Test User",
    }
    });

}

main().catch(console.error);

// prisma.$on("query", async (e) => {
//     console.log(`${e.query} ${e.params}`)
// });