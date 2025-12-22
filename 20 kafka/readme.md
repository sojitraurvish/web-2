// start kafka container
// docker run -d -p 9092:9092 apache/kafka:3.7.1

// docker ps
// docker exec -it <container id> /bin/sh
// cd /opt/kafka/bin

/ $ cd /opt/kafka/bin
/opt/kafka/bin $ ls
connect-distributed.sh              kafka-dump-log.sh                   kafka-server-stop.sh
connect-mirror-maker.sh             kafka-e2e-latency.sh                kafka-storage.sh
connect-plugin-path.sh              kafka-features.sh                   kafka-streams-application-reset.sh
connect-standalone.sh               kafka-get-offsets.sh                kafka-topics.sh
kafka-acls.sh                       kafka-jmx.sh                        kafka-transactions.sh
kafka-broker-api-versions.sh        kafka-leader-election.sh            kafka-verifiable-consumer.sh
kafka-client-metrics.sh             kafka-log-dirs.sh                   kafka-verifiable-producer.sh
kafka-cluster.sh                    kafka-metadata-quorum.sh            trogdor.sh
kafka-configs.sh                    kafka-metadata-shell.sh             windows
kafka-console-consumer.sh           kafka-mirror-maker.sh               zookeeper-security-migration.sh
kafka-console-producer.sh           kafka-producer-perf-test.sh         zookeeper-server-start.sh
kafka-consumer-groups.sh            kafka-reassign-partitions.sh        zookeeper-server-stop.sh
kafka-consumer-perf-test.sh         kafka-replica-verification.sh       zookeeper-shell.sh
kafka-delegation-tokens.sh          kafka-run-class.sh
kafka-delete-records.sh             kafka-server-start.sh

 // creaet topic and url where kafka is running
 ./kafka-topics.sh --create --topic quickstart-events<name of topic> --bootstrap-server localhost:9092<url on which kafka is running inside the container>
 Created topic quickstart-events.

// consumeer 
./kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server localhost:9092
./kafka-console-consumer.sh --topic quickstart-events<topic form where i want to consume from> --from-beginning<i want to consume from bigingin of this topic so from very fisrt offeset> --bootstrap-server localhost:9092<url on which kafka is running inside the container>

// produser
./kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
./kafka-console-producer.sh --topic quickstart-events<topic form where i want to publish from>  --bootstrap-server localhost:9092<url on which kafka is running inside the container>

// this is similar to redis pubsub because both of these consumer get the events

// terminal 1 consumer
/opt/kafka/bin $ ./kafka-console-consumer.sh --topic quickstart-events --from-be
ginning --bootstrap-server localhost:9092
hi there
what are you doing

// terminal 2 publisher
/opt/kafka/bin $ ./kafka-console-producer.sh --topic quickstart-events --bootstrap-server localhost:9092
>hi there
>what are you doing 
>


// terminal 3 consumer - started this letter on from bigining
/opt/kafka/bin $ ./kafka-console-consumer.sh --topic quickstart-events --from-be
ginning --bootstrap-server localhost:9092
hi there
what are you doing 


// run the code - when you have single file for both consumer and producer
// { partition: 0, offset: '0', value: 'hi there' }
// { partition: 0, offset: '1', value: 'what are you doing ' }
// { partition: 0, offset: '2', value: 'Hello KafkaJS user!' }
// what is this partitiona and offset, and consumer groups

// when i have seperate code for consumer and publish and when i start 3 consumer and only one producer for same channel then when i produce event it goes to 1 of theme condumer(if 1 goes down then it send to another one) not all three(as it was going termial to all the cusumer) and the answer lay in consumer group id
so consumer group id is to load balance the events so kafka will not send events to all 3 it sends to 1 of 3 and it will load balance event some how, because they belongs to same consumer group via this id, if you add redom id via MAth.remdom then all will recive events,
but right now it is not loadbalcing events between 3 consumers for that we need to understand partitions 

so your sigle topic can have multiple partitions(let say 3) and whenever you produce the message it reaches to one of three partitions 
partitions allow kafka to scale horizontally and allow for parallel processing of the message, at abve we are not able to paralarli process
the meassages because we had single partition, because when we created a topic we did not specified the number for how manay partitions and 
that is why it had single partition, if you want to scale horizontaally if you want that half of my messages goes to this consumer and half of to this consumer then you have to create a multiple partitions

if you have multiple partition then kafka will decide that half of my message should goes to this consumer in same consumer group and half of to this consumer in the same consumer group

// so now lets create new topic with 3 partitions(see code 3)(in second code we had only 1 partition so it send events to only 1 consumer event though we had 3-4)
 ./kafka-topics.sh --create --topic payment-done --partitions 3 --bootstrap-server localhost:9092
 // just describe more info when partition is created
 ./kafka-topics.sh --describe --topic payment-done --partitions 3 --bootstrap-server localhost:9092

 any time in future you can increate the consumer but partiions you provide when you create the tipic

 so if you have 3 partion and 3 conssumer (see pic 2)
 p1 -> c1 - when you create c4 is assign to p1 but do not get the evnet untill c1 is alive
 p2 -> c2
 p3 -> c3

 // what if we have 2 consumer group(see pic 3)
 then all the messages will goes to consumer grop 1 also and consumer group 2 also , there is not load balanceing happeing between accross
 two consumer group

 // to see which partition assign to which consumer in same consumer group
  ./kafka-consumer-groups.sh --bootstrap-server localhost:9092 --
describe --group payment-done-group

GROUP              TOPIC           PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID           <id>                      HOST            CLIENT-ID
payment-done-group payment-done    0          1               1               0               my-app-<3621e95f>-9337-4dc0-8f19-710dc0b4d495 /192.168.65.1   my-app
payment-done-group payment-done    1          5               5               0               my-app-<3621e95f>-9337-4dc0-8f19-710dc0b4d495 /192.168.65.1   my-app
payment-done-group payment-done    2          3               3               0               my-app-<6f7c6fcc>-b60f-4793-bb63-3a8bca892d2d /192.168.65.1   my-app
/opt/kafka/bin $ 


// now if you have 3 partions then if malitious user comes in you leetcode and sumbmit 100-100 probelms in each partiions (it is rendomly assigned) but still create a problme so we want to do something like that if same user is submiting things then it should always goes to same
partion so only one of the queue or partiion and consumer is chocked not all of the partitions

// second usecase where if at fist users's fist notification will picked up then and only second one should pick up then also in this case
it should goes to same partition or queue

so in above two cases you need to have partition key


// another usecase where you have primium user and free users