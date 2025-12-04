import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const users = await prisma.user.update({
        where:{
            id: 1,
        },
        data:{
            posts:{
                deleteMany:{
                  published: false,   
                }
            }
        }
    })
    console.log("User:", users);
}

main().catch(console.error);