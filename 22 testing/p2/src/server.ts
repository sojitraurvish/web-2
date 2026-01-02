import express from "express";
import z from "zod"

export const app = express();// we export it because we want our tests to import it and use 

app.use(express.json());

const sumInput=z.object({
    a:z.number(),
    b:z.number(),
})

app.post("/sum",(req,res)=>{
    const parsedResponse=sumInput.safeParse(req.body);

    if(!parsedResponse.success){ // now for this case i also have to add tests
        res.status(411).json({error:"Invalid input"});
        return;
    } 
 
   const {a,b}=parsedResponse.data;
   
   const result=Number(a)+Number(b);
   res.json({result});
});

// even in this file i did not started the http server on any port because when we test our appp we do not want it to start on any port we want test to run and automatically find out the routes and test them
// because when you are testting you do not want any resourse of the machine to start and and if you do not do it then when test runs it actullay start the server on that port, and why we do not write test by our self because it runs on github machine over there you might not have port 3000 access there right so these libaries simulate the envaroment like that and that is why you use library to test your app becase you can also test it vai axios right but you do not do dute to above reason
// so when you have these test you do have app.listen in same file you export your server and you have bin folder in which you have server.ts at where you start the server or  in just simplaly bin file you start your server