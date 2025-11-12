interface Order {
    price: number;
    quantity: number;
    orderId: string;
}

export interface Ask extends Order {
    side: 'sell';
}

export interface Bid extends Order {
    side: 'buy';
}   

export interface Orderbook {
    asks: Ask[],
    bids: Bid[],
}

export const orderbook: Orderbook = {
    asks: [],
    bids: [],
}

export interface OrderbookWithQuantity {
    asks: {[price: number]: number};
    bids: {[price: number]: number};
}
export const orderbookWithQuantity: OrderbookWithQuantity = {
    asks:{},
    bids:{},
}