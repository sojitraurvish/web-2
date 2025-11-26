import { z } from "zod";

export const Side = {
    BUY: "buy",
    SELL: "sell",
} as const;
export type Side = typeof Side[keyof typeof Side];

export const Type = {
    LIMIT: "limit",
    MARKET: "market",
} as const;
export type Type = typeof Type[keyof typeof Type];

export const Kind = {
    IOC: "ioc",
} as const;
export type Kind = typeof Kind[keyof typeof Kind];

export const orderSchema = z.object({
    baseAsset: z.string(),
    quoteAsset: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive(),
    side: z.enum(Side),
    type: z.enum(Type),
    kind: z.enum(Kind).optional(),
});




