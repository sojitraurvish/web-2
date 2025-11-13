import { Ticker } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/"

export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: any[] = [];// MINE-NOTE: a buffer to store the messages that are not yet sent to the server due to the connetion is not established yet and you jsut nned to call then send message function and in case of socket io it also has the same code inner the hood so you do need to check Socket.connected{Seocket.emit} 
    private callbacks: any = {};
    private id: number;
    private initialized: boolean = false;

    private constructor() { // MINE-NOTE: a class has private contractor that is called singleton pattern
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new SignalingManager();
        }
        return this.instance;
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if (this.callbacks[type]) {
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        }

                        callback(newTicker);
                   }
                   if (type === "depth") {
                        // const newTicker: Partial<Ticker> = {
                        //     lastPrice: message.data.c,
                        //     high: message.data.h,
                        //     low: message.data.l,
                        //     volume: message.data.v,
                        //     quoteVolume: message.data.V,
                        //     symbol: message.data.s,
                        // }
                        // console.log(newTicker);
                        // callback(newTicker);
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }
                });
            }
        }
    }

    sendMessage(message: any) {
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback(type: string, callback: any, id: string) { // MINE-NOTE: registert the callback funtion which will rerender new data seee marketBar.tsx
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
        // "ticker" => callback
    }

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}


// export const MarketBar = ({market}: {market: string}) => {
//     const [ticker, setTicker] = useState<Ticker | null>(null);

//     useEffect(() => {
//         getTicker(market).then(setTicker);
//         SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>)  =>  setTicker(prevTicker => ({
//             firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
//             high: data?.high ?? prevTicker?.high ?? '',
//             lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
//             low: data?.low ?? prevTicker?.low ?? '',
//             priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
//             priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '', 
//             quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
//             symbol: data?.symbol ?? prevTicker?.symbol ?? '',
//             trades: data?.trades ?? prevTicker?.trades ?? '',
//             volume: data?.volume ?? prevTicker?.volume ?? '',
//         })), `TICKER-${market}`);
//         SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);

//         return () => {
//             SignalingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
//             SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
//         }
    // }, [market])


    // setBids((originalBids) => {
    //     const bidsAfterUpdate = [...(originalBids || [])]; // MINE-NOTE: if you are ever need update state variable then first make a copy of it and then update other wise sometimes it does not rerender the ui 

    //     for (let i = 0; i < bidsAfterUpdate.length; i++) {
    //         for (let j = 0; j < data.bids.length; j++)  {
    //             if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
    //                 bidsAfterUpdate[i][1] = data.bids[j][1];
    //                 break;
    //             }
    //         }
    //     }
    //     return bidsAfterUpdate; 
    // });