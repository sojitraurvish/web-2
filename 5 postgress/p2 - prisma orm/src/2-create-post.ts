import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const post = await prisma.post.create({
        data: {
            title: "Test Post",
            content: "This is a test post",
            authorId: 1,
            published: true,
        },
    });
    console.log("Post created:", post);
}

main().catch(console.error);