import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const user = await prisma.user.update({
        where:{
            id:1,
        },
        data:{
            name: "harkiratsingh3",
            email: "harkiratsingh3@gmail.com",
        }
    })
    console.log("User:", user);
}

main().catch(console.error);