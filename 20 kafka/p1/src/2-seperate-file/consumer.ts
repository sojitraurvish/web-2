 import { Kafka } from "kafkajs";

 const kafka = new Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
 });

 const consumer = kafka.consumer({ groupId: "test-group" });
 // run the code - when you have single file for both consumer and producer
// { partition: 0, offset: '0', value: 'hi there' }
// { partition: 0, offset: '1', value: 'what are you doing ' }
// { partition: 0, offset: '2', value: 'Hello KafkaJS user!' }
// what is this partitiona and offset, and consumer groups

// when i have seperate code for consumer and publish and when i start 3 consumer and only one producer for same channel then when i produce event it goes to 1 of theme condumer not all three(as it was going termial to all the cusumer) and the answer lay in consumer group id
// so consumer group id is to load balance the events so kafka will not send events to all 3 it sends to 1 of 3 and it will load balance event some how

 const main = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "quickstart-events", fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        },
    });
 }

 main().catch(console.error);