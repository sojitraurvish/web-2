import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const user = await prisma.user.create({
        data: {
            email: "test4@test.com",
            name: "Test User",
            posts: {
                create:[{
                    title: "Test Post",
                    content: "This is a test post",
                    published: true,
                },
                {
                    title: "Test Post 2",
                    content: "This is a test post 2",
                    published: true,
                },
                {
                    title: "Test Post 3",
                    content: "This is a test post 3",
                    published: true,
                },
            ]
            },
        },
    });
    console.log("User created:", user);
}

main().catch(console.error);