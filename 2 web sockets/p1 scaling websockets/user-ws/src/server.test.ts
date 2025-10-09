import { WS_EVENTS } from "./utils/constants";

const BACKEND_URL = "ws://localhost:3000";

describe("Chat application", () => {
    test("Message sent form room 1 should be received by another user in room 1", async () => {
        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL);

        await new Promise<void>((resolve,reject)=>{
            let count = 0;
            ws1.onopen = (event) => {
                count++;
                if(count === 2){
                    resolve();
                }
            }
            ws2.onopen = (event) => {
                count++;
                if(count === 2){
                    resolve();
                }
            }
        })

        ws1.send(JSON.stringify({
            type:WS_EVENTS.JOIN_ROOM,
            room:"root-123"
        }))

        ws2.send(JSON.stringify({
            type:WS_EVENTS.JOIN_ROOM,
            room:"root-123"
        }))


        await new Promise<void>((resolve,reject)=>{
            ws2.onmessage = ({data}) => {
                const {type,message} = JSON.parse(data.toString());
             
                // Only check MESSAGE events, ignore CONNECTED events
                if (type === WS_EVENTS.MESSAGE) {
                    expect(type).toBe(WS_EVENTS.MESSAGE);
                    expect(message).toBe("Hello Urvish");
                    resolve();
                }
            } 

            ws1.send(JSON.stringify({
                type:WS_EVENTS.SEND_MESSAGE,
                room:"root-123",
                message:"Hello Urvish"
            }))
            

        })

        ws1.close();
        ws2.close();
        
    });
});



