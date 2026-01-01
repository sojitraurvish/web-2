// https://projects.100xdevs.com/tracks/grpc/grpc-1 
json rpc(send json data- blockchain), rpc, grpc, trpc - you do not have to worry about underlaying things you just need to call function

trpc - types (frontend and backend in js)

grpc in any languages

when you have 20,000 req per sec then you need this to reduce your infracture cost(ec2 cost + bendwith cost) 
grpc compress data lot
and graphql is similar tec to do same thing

if you call backend from another backend via http then you do not have types supperts so when you call api you do not know 
what data will you get so you can user trpc but it only exists in js tec but what if you have backend in diff languages like go, java
rust, and many more, so use rpc or grpc(compress data via proto buffs - to scale the server)

rpc - (also you auto generate client for all language) (use libray to implement rpc - (see p 1)harkirat have created dumb implimation by wirign row code but you need to use libray to implemnt rpc)

grpc and proto buffes are diff thing

{when you want to scale if you have 1 users}
proto buffs - compresss data and then send over to server to reduce your ec2 and bandwith cost 

(borsh.js explore this )

// .proto file usecase you can add in postman and get all the metionds and you can auto generate client for all languages 

// but what about proper types - @grpc/proto-loader give you script that help you create types
// node node_modules/@grpc/proto-loader/build/bin/groto-loader-gen-types.js 
// so via this script you can create types for your .proto file 
// ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js  --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=./src/generated ./src/a.proto