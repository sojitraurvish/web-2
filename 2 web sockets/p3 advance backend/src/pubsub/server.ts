import { PubSubManager } from "./pubsub-manage";

const pubSubManager = PubSubManager.getInstance();

// Simulate users subscribing every 5 seconds
setInterval(() => {
  const userId = Math.random().toString(36).substring(2, 8);
  const stock = "AAPL";

  pubSubManager.userSubscribe(userId, stock);
}, 5000);
