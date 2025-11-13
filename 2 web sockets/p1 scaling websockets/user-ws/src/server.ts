import {WebSocketServer, WebSocket} from "ws";
import { WS_EVENTS} from "./utils/constants";
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 3002 });

const rooms:Record<string,string[]>={};
const sockets = new Map<string, WebSocket>();

const RELAYER_URL = "ws://localhost:8000";
const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.on("message",(message:string)=>{

           
           const parsedMessage = JSON.parse(message);
           const { room, socketId, type, message: msg } = parsedMessage;
           
           console.log("Parsed message from relayer:", parsedMessage);
    const senderSocket = sockets.get(socketId);

    console.log("Received message from relayer", sockets.keys());
    
    
    if(rooms[room]){
        rooms[room].forEach((socket)=>{
            console.log("Socket", socket);
            if(socket !== socketId){  // Exclude the sender
                sockets.get(socket)?.send(JSON.stringify({ type: WS_EVENTS.MESSAGE, message: msg }));
            }
        });
       
    }else{
        senderSocket?.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: "Room not found" }));
    }
})

// in websocket data comes in two formmrt only string and binary    
wss.on("connection", (ws: WebSocket) => {
    const socketId = uuidv4();
    sockets.set(socketId, ws);
    console.log("Socket connected", sockets.keys());
    
    ws.on("error", (e)=>{
        console.log("Error", e);
    });

    ws.on("message", (message: string) => {
        const { room, type, message: msg} = JSON.parse(message);// sends string or binary data

        if(type===WS_EVENTS.JOIN_ROOM){
            if(!rooms[room]){
                rooms[room]=[]
            }
            
            // Check if the WebSocket is already in the room before adding
            if(!rooms[room].includes(socketId)){
                rooms[room].push(socketId);
                ws.send(JSON.stringify({ type: WS_EVENTS.CONNECTED, message: `User joined the room ${room} successfully!` }));
            } else {
                ws.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: `You are already in room ${room}` }));
            }
        }

        if(type===WS_EVENTS.SEND_MESSAGE){
            if(rooms[room].includes(socketId)){
                relayerSocket.send(JSON.stringify({
                    type,
                    room,
                    message: msg,
                    socketId,
                }));
            }
            else{
                ws?.send(JSON.stringify({ type: WS_EVENTS.ERROR, message: `You are not in room ${room}` }));
            }
        }
    });

    // Clean up when WebSocket disconnects
    ws.on("close", () => {
        console.log("User disconnected");
        sockets.delete(socketId);
        // Remove the socket from all rooms
        Object.keys(rooms).forEach((room) => {
            rooms[room] = rooms[room].filter((socket) => socket !== socketId);
            // Clean up empty rooms
            if (rooms[room].length === 0) {
                delete rooms[room];
            }
        });
    });

    ws.send(JSON.stringify({ type: WS_EVENTS.CONNECTED, message: "Welcome to the server" }));
});

