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
        messages: [{ value: "Hello KafkaJS user! from producer to payment-done" }],
    })
}

main().catch(console.error);