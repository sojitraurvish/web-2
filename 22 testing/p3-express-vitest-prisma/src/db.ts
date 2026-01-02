import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();

// when some buddy run this code you want that the actull code should be replated by bellow(empty  function) so that it does not perform the actul test

// const prismaCient2 ={
//     sum:{
//         create:()=>{

//         }
//     }
// }

// so how can we do this, see index.test.ts file