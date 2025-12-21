// string redis locally
docker run --name my-redis -d -p 6379:6379 redis

// conntecting to your cointer to go inside
docker exec -it <contaienr_id> /bin/sh

connectiong to the redis cli
redis-cli

// redis as database
127.0.0.1:6379> SET mykey "hello"
\OK
127.0.0.1:6379> get mykey
"hello"
127.0.0.1:6379> del mykey
(integer) 1
127.0.0.1:6379> get mykey

127.0.0.1:6379> SET tracks:100 "[{title:'typescript',desc:'jus fun'}]"
OK
127.0.0.1:6379> get tracks:100
"[{title:'typescript',desc:'jus fun'}]"
127.0.0.1:6379> del tracks
(integer) 0
127.0.0.1:6379> get taacks
(nil)


redis as queue
127.0.0.1:6379> LPUSH problems 1
(integer) 1
127.0.0.1:6379> LPUSH problems 2
(integer) 2
127.0.0.1:6379> RPOP problems
"1"
127.0.0.1:6379> RPOP problems
"2"
127.0.0.1:6379> RPOP problems
(nil)

127.0.0.1:6379> LPUSH problems "{problems1:2,userId:3,problem...}"
(integer) 1
127.0.0.1:6379> RPOP problems
"{problems1:2,userId:3,problem...}"
127.0.0.1:6379> RPOP problems
(nil)

//Blocking queue and queue

Terminal 1
127.0.0.1:6379> BRPOP problems 10 - wait for 10 sec and only takes one problem
1) "problems"
2) "1"
(1.62s)
127.0.0.1:6379> BRPOP problems 0 - wait for infinite time and only pop one problem 
1) "problems"
2) "1"
(4.79s)

Terminal 2
127.0.0.1:6379> LPUSH problems 1
(integer) 1
127.0.0.1:6379> LPUSH problems 2
(integer) 1
127.0.0.1:6379> LPUSH problems 3
(integer) 2


// redis as pubsub

// terminal 1
127.0.0.1:6379> SUBSCRIBE apple - goes to multiple teminal if subscribed
1) "subscribe"
2) "apple"
3) (integer) 1
1) "message"
2) "apple"
3) "200.2"

// terminal 2
127.0.0.1:6379> PUBLISH apple 200.2
(integer) 1



backend communication 
sync             async
statefull        stateless -> add in queue -> to store in db (other wise state will be lost) 
stickiness
chess (why)? ->
router lodebalancer  -  also store router state indb  
ws1) ws2) say to router that i am alive you can send the user

web socket scaling 2 ways 
1)stickyness (above)
2) pubsub (instead pubsub we used relayer layer in above code outof the folder)

