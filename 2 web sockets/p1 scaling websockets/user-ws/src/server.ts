import {WebSocketServer, WebSocket} from "ws";
import { WS_EVENTS} from "./utils/constants";

const wss = new WebSocketServer({ port: 3000 });

interface Room{
    sockets:WebSocket[];
}

const rooms:Record<string,Room>={};

const RELAYER_URL = "ws://localhost:8000";
const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.on("message",(message:string)=>{
    wss.clients.forEach((client:WebSocket)=>{
        client.send(message);
    })
})

// in websocket data comes in two formmrt only string and binary    
wss.on("connection", (ws: WebSocket) => {
    ws.on("error", (e)=>{
        console.log("Error", e);
    });

    ws.on("message", (message: string) => {
        const { room, type, message: msg } = JSON.parse(message);

        if(type===WS_EVENTS.JOIN_ROOM){
            if(!rooms[room]){
                rooms[room]={
                    sockets:[]
                };
            }
            
            // Check if the WebSocket is already in the room before adding
            if(!rooms[room].sockets.includes(ws)){
                rooms[room].sockets.push(ws);
                ws.send(JSON.stringify({ type: WS_EVENTS.CONNECTED, message: `User joined the room ${room} successfully!` }));
            } else {
                ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: `You are already in room ${room}` }));
            }
        }

        if(type===WS_EVENTS.SEND_MESSAGE){
            console.log("Sending message to room", !rooms[room]);
            if(rooms[room]){
                if(rooms[room].sockets.includes(ws)){
                    rooms[room].sockets.forEach((socket)=>{
                        if(socket !== ws){  // Exclude the sender
                            socket.send(JSON.stringify({ type: WS_EVENTS.MESSAGE, message: msg }));
                        }
                    });
                }else{
                    ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: `You are not in room ${room}` }));
                }
            }else{
                ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: "Room not found" }));
            }
        }
    });

    // Clean up when WebSocket disconnects
    ws.on("close", () => {
        console.log("User disconnected");
        // Remove the socket from all rooms
        Object.keys(rooms).forEach((room) => {
            rooms[room].sockets = rooms[room].sockets.filter((socket) => socket !== ws);
            // Clean up empty rooms
            if (rooms[room].sockets.length === 0) {
                delete rooms[room];
            }
        });
    });

    ws.send(JSON.stringify({ type: WS_EVENTS.CONNECTED, message: "Welcome to the server" }));
});

