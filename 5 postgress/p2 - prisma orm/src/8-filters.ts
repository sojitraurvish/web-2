import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const user = await prisma.user.findMany({
        where:{
            email:{
                endsWith:"gmail.com",
            },
            posts:{
                //has atleast one post published
                some:{
                    published:true,
                }
            }
        },
        include:{
            posts:{
                where:{
                    published:true,
                }
            }
        }
       
    })
    console.log("User:", user);
}

main().catch(console.error);