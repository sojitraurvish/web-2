import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const main = async () => {
    await producer.connect();
    
    await producer.send({
        topic: "payment-done",
        messages: [{ 
            value: "Hello KafkaJS user! from producer to payment-done", 
            key:"user1id" // it hash this and covert into 0, or 1, or 2 as per the partition and send your messag to the same partition
        }],
    })
}

main().catch(console.error);