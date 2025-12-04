import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const posts = await prisma.post.findMany({
        include:{
            author:{
                select:{
                    email:true,
                }
            }
            
        }
    })
    console.log("Posts:", posts);
}

main().catch(console.error);