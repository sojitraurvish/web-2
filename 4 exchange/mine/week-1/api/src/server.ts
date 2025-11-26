import express from "express";
import { Ask, Bid, orderbook, orderbookWithQuantity } from "./orderbook.js";
import { Kind, orderSchema, Side, Type } from "./types.js";
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(express.json());

const BASE_ASSETS = "BTC"
const QUOTE_ASSETS = "USD"

// Utility function to fix floating point precision issues
const fixDecimals = (number: number, decimals: number = 8): number => {
    return Number(number.toFixed(decimals));
}

app.post("/api/v1/order", (req, res) => {
    const order = orderSchema.safeParse(req.body);
    if(!order.success) {
        return res.status(400).json({ message: "Invalid order",errors: order.error.issues });
    }

    const {baseAsset, quoteAsset, price, quantity, side, type, kind} = order.data;
    const orderId = uuidv4();

    if(baseAsset !== BASE_ASSETS || quoteAsset !== QUOTE_ASSETS){
        return res.status(400).json({ message: "Invalid base asset or quote asset" });
    }

    const {executedQty, fills} = fillOrder(orderId, price, quantity, side, kind);
    

    res.status(201).json({ orderId, executedQty, fills});
});

app.listen(9000, () => {
    console.log("Server is running on port 3000");
});

let GLOBAL_TRADE_ID = 0;

interface Fill {
    price: number;
    quantity: number;
    tradeId: number;
}


const fillOrder = (orderId: string, price: number, quantity: number, side: Side, kind?: Kind): { status: "rejected" | "partially_filled" | "filled", executedQty: number, fills: Fill[] } => {
    const fills: Fill[] = [];
    const maxFillQuantity = getFillAmount(price, quantity, side);
    let executedQty = 0;


    if(kind === Kind.IOC && maxFillQuantity < quantity) {
        return {
            status: "rejected",
            executedQty: 0,
            fills: []
        };
    }

    if(side === Side.BUY){
        // Use filter instead of forEach to avoid array mutation issues
        for(let i = 0; i < orderbook.asks.length; i++){
            const ask = orderbook.asks[i];
            console.log("outer ask", ask);
            if(ask.price <= price && quantity > 0){
                console.log("ask", ask);
                const filledQuantity = Math.min(ask.quantity, quantity);
                ask.quantity = fixDecimals(ask.quantity - filledQuantity);
                orderbookWithQuantity.asks[ask.price] = fixDecimals((orderbookWithQuantity.asks[ask.price] || 0) - filledQuantity);
                fills.push({
                    price: ask.price,
                    quantity: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID++
                });
                executedQty = fixDecimals(executedQty + filledQuantity);
                quantity = fixDecimals(quantity - filledQuantity);

                if(ask.quantity === 0){
                    orderbook.asks.splice(i, 1);
                    i--; // Decrement i to account for the removed element
                }       
                if(orderbookWithQuantity.asks[ask.price] === 0){
                    delete orderbookWithQuantity.asks[ask.price];
                }
            }
        }

        if(quantity !== 0){
            // quantity already represents remaining unfilled quantity
            // Find the correct position to insert in ascending order by price
            // let insertIndex = 0;
            // while(insertIndex < orderbook.bids.length && orderbook.bids[insertIndex].price <= price){
            //     insertIndex++;
            // }
            // Binary search: O(log n) search + O(n) splice = O(n) total
            const binarySearchInsert = (arr: any[], price: number) => {
                let left = 0, right = arr.length;
                while (left < right) {
                    const mid = Math.floor((left + right) / 2);
                    if (arr[mid].price <= price) left = mid + 1;
                    else right = mid;
                }
                return left;
            }
            const insertIndex = binarySearchInsert(orderbook.bids, price);
            orderbook.bids.splice(insertIndex, 0, {
                side: Side.BUY,
                price: price,
                quantity: quantity,
                orderId: orderId
            });

            orderbookWithQuantity.bids[price] = fixDecimals((orderbookWithQuantity.bids[price] || 0) + quantity);
        }

    }

    if(side === Side.SELL){
        // Use reverse for loop to avoid array mutation issues
        for(let i = 0; i < orderbook.bids.length; i++){
            const bid = orderbook.bids[i];
            if(bid.price >= price && quantity > 0){
                const filledQuantity = Math.min(bid.quantity, quantity);
                bid.quantity = fixDecimals(bid.quantity - filledQuantity);
                orderbookWithQuantity.bids[bid.price] = fixDecimals((orderbookWithQuantity.bids[bid.price] || 0) - filledQuantity);

                fills.push({
                    price: bid.price,
                    quantity: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID++
                })
                executedQty = fixDecimals(executedQty + filledQuantity);
                quantity = fixDecimals(quantity - filledQuantity);

                if(bid.quantity === 0){
                    orderbook.bids.splice(i, 1);
                    i--; // Decrement i to account for the removed element
                }
                if(orderbookWithQuantity.bids[bid.price] === 0){
                    delete orderbookWithQuantity.bids[bid.price];
                }
                
            }
        }

        if(quantity!==0){
            // quantity already represents remaining unfilled quantity
            // Binary search: O(log n) search + O(n) splice = O(n) total
            const binarySearchInsert = (arr: Bid[] | Ask[], price: number) => {
                let left = 0, right = arr.length;
                while (left < right) {
                    const mid = Math.floor((left + right) / 2);
                    if (arr[mid].price <= price) left = mid + 1;
                    else right = mid;
                }
                return left;
            }
            const insertIndex = binarySearchInsert(orderbook.asks, price);
            orderbook.asks.splice(insertIndex, 0, {
                side: Side.SELL,
                price: price,
                quantity: quantity,
                orderId: orderId
            });

            orderbookWithQuantity.asks[price] = fixDecimals((orderbookWithQuantity.asks[price] || 0) + quantity);
        }
    }

    console.log(orderbookWithQuantity);
    console.log(orderbook);
    
    
    return {
        status: "filled",
        executedQty: executedQty,
        fills: fills
    };
}

const getFillAmount = (price: number, quantity: number, side: Side) => {
    let fillQuantity = 0;

    if(side === Side.BUY){
        orderbook.asks.forEach(ask => {
            if(ask.price <= price){ // 10000 <= 10000 (true) , 9000 <= 10000 (true) , 10001 <= 10000 (false)
                fillQuantity = Math.min(ask.quantity, quantity);
            }
        });
    } else {
        orderbook.bids.forEach(bid => {
            if(bid.price >= price){// 10000 >= 10000 (true) , 9000 >= 10000 (false) , 10001 >= 10000 (true)
                fillQuantity = Math.min(bid.quantity, quantity);
            } 
        });
    }
 
    return fillQuantity;
}

