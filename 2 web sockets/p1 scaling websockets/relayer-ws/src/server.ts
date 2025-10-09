import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

const server:WebSocket[] = []

wss.on("connection",(ws:WebSocket)=>{
   
    server.push(ws);
    console.log("Server connected", server.length);

    ws.on("message",(message:string)=>{
        console.log("message received", message);
        server.forEach((ws:WebSocket)=>{
            console.log("sending message to all servers", message);
            ws.send(message);
        })
    })
})
