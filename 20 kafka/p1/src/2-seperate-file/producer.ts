import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const main = async () => {
    await producer.connect();
    
    await producer.send({
        topic: "quickstart-events",
        messages: [{ value: "Hello KafkaJS user! from producer" }],
    })
}

main().catch(console.error);