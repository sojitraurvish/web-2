import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from "redis"

const publishClient = createClient(); // here we create 2 diff client 1 for subscribe and 1 to publish if you use same for both it will not work so 
publishClient.connect(); // you should await this fist then onely cerate websocket server

const subscribeClient = createClient();
subscribeClient.connect();

const wss = new WebSocketServer({ port: 8080 });

const subscriptions: {[key: string]: {
    ws: WebSocket,
    rooms: string[] // do not create the room like this in code p1 room logic is more optimized
}} = {

}

// setInterval(() => {
//     console.log(subscriptions);
// }, 5000);


wss.on('connection', function connection(userSocket) {
    const id = randomId();
    subscriptions[id] = {
        ws: userSocket,
        rooms: []
    }
  
    userSocket.on('message', function message(data) {
        const parsedMessage = JSON.parse(data as unknown as string);
        if (parsedMessage.type === "SUBSCRIBE") {
            subscriptions[id].rooms.push(parsedMessage.room);
            if (oneUserSubscribedTo(parsedMessage.room)) { // only subscribe to pubsub for room1 once only
                console.log("subscribing on the pub sub to room " + parsedMessage.room);
                subscribeClient.subscribe(parsedMessage.room, (message) => {
                    const parsedMessage = JSON.parse(message);
                    Object.keys(subscriptions).forEach((userId) => {
                        const {ws, rooms} = subscriptions[userId];
                        if (rooms.includes(parsedMessage.roomId)) {
                            ws.send(parsedMessage.message);
                        }
                    })
                })
            }
        }
        
        if (parsedMessage.type === "UNSUBSCRIBE") {
            subscriptions[id].rooms = subscriptions[id].rooms.filter(x => x !== parsedMessage.room)
            if (lastPersonLeftRoom(parsedMessage.room)) {
                console.log("unsubscribing from pub sub on room" + parsedMessage.room);
                subscribeClient.unsubscribe(parsedMessage.room);
            }
        }

        if (parsedMessage.type === "sendMessage") {
            const message = parsedMessage.message;
            const roomId = parsedMessage.roomId;
            
            publishClient.publish(roomId, JSON.stringify({
                type: "sendMessage",
                roomId: roomId,
                message
            }))
        }
    });

});

function oneUserSubscribedTo(roomId: string) {
    let totalInterestedPeople = 0;
    Object.keys(subscriptions).map(userId => {
        if (subscriptions[userId].rooms.includes(roomId)) {
            totalInterestedPeople++;
        }
    })
    if (totalInterestedPeople == 1) {
        return true;
    }
    return false;
}

function lastPersonLeftRoom(roomId: string) {
    let totalInterestedPeople = 0;
    Object.keys(subscriptions).map(userId => {
        if (subscriptions[userId].rooms.includes(roomId)) {
            totalInterestedPeople++;
        }
    })
    if (totalInterestedPeople == 0) {
        return true;
    }
    return false;
}

function randomId() {
    return Math.random();
}
