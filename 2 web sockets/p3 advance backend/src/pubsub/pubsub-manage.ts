import { createClient, RedisClientType } from "redis";

export class PubSubManager {
  private static instance: PubSubManager;
  private redisClient: RedisClientType;
  private subscriptions: Map<string, string[]>;

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
    this.subscriptions = new Map();
  }

  // Singleton accessor
  public static getInstance(): PubSubManager {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }
    return PubSubManager.instance;
  }

  // Subscribe a user to a stock channel
  public async userSubscribe(userId: string, stock: string): Promise<void> {
    if (!this.subscriptions.has(stock)) {
      this.subscriptions.set(stock, []);
    }

    this.subscriptions.get(stock)!.push(userId);

    // Subscribe to Redis channel only once per stock
    if (this.subscriptions.get(stock)!.length === 1) {
      await this.redisClient.subscribe(stock, (message: string) => {
        this.handleMessage(stock, message);
      });

    //   await this.redisClient.publish(stock, "200.2");

      console.log(`Subscribed to Redis channel: ${stock}`);
    }
  }

  // Unsubscribe a user from a stock channel
  public async userUnsubscribe(userId: string, stock: string): Promise<void> {
    if (!this.subscriptions.has(stock)) return;

    const users = this.subscriptions
      .get(stock)!
      .filter((id) => id !== userId);

    this.subscriptions.set(stock, users);

    if (users.length === 0) {
      await this.redisClient.unsubscribe(stock);
      this.subscriptions.delete(stock);
      console.log(`Unsubscribed from Redis channel: ${stock}`);
    }
  }

  // Handle incoming Redis messages
  private handleMessage(stock: string, message: string): void {
    console.log(`Message received on channel ${stock}: ${message}`);

    const users = this.subscriptions.get(stock) || [];
    users.forEach((userId) => {
      console.log(`Sending message to user ${userId}`);
    });
  }

  // Cleanup Redis connection
  public async disconnect(): Promise<void> {
    await this.redisClient.quit();
  }
}
