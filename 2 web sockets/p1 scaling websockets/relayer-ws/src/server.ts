import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8000 });

const server:WebSocket[] = []

wss.on("connection",(ws:WebSocket)=>{
   
    server.push(ws);

    ws.on("message",(message:string)=>{
        server.forEach((ws:WebSocket)=>{
            ws.send(message);
        })
    })
})
