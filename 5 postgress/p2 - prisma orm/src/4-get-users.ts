import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
    const users = await prisma.user.findMany();
    console.log("Users:", users);

    for(const user of users){
        console.log("User:", user.name, user.email);
    }
    const user = await prisma.user.findUnique({
        where:{ 
            id: 1,
        },
        // include:{ inclides all the post of the user
        //     posts:true,
        // }
    })
    console.log("User:", user);
}

main().catch(console.error);