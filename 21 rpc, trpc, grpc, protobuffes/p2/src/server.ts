import path from 'path';
import * as grpc from '@grpc/grpc-js';// as like http grpc is also one protocol
import  { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/a';
import { AddressBookServiceHandlers } from './generated/AddressBookService';
import { Status } from '@grpc/grpc-js/build/src/constants';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, './a.proto'));//parse your proto file

//load your proto file defination
const personProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;



// const server = express();
const server = new grpc.Server();

const PERSONS = [
    {
        name: "harkirat",
        age: 45
    },
    {
      name: "raman",
      age: 45
    },
];


const handlers:AddressBookServiceHandlers={
  AddPerson: (call, callback) => {
    console.log(call)
    let person = {
      name: call.request.name,
      age: call.request.age
    }
    PERSONS.push(person);
    callback(null, {
      name: person.name,
      age: person.age
    });
  },
  GetPersonByName: (call, callback) => {
    console.log(call)
    const person = PERSONS.find(p => p.name === call.request.name);
    if(person){
      callback(null, person);
    }else{
      callback({
        code: Status.NOT_FOUND,
        message: "Person not found"
      }, null);
    }
  },
  DeleteUserByName: (call, callback) => {
    console.log(call)
    const person = PERSONS.find(p => p.name === call.request.name);
    if(person){
      PERSONS.splice(PERSONS.indexOf(person), 1);
      callback(null, person);
    }else{
      callback(new Error("Person not found"), {
        name: "",
        age: 0
      });
    }
  }
} as const;

// app.use("/api/v1/user",userRoutes);
server.addService(personProto.AddressBookService.service, handlers);
// app.use("/api/v1/todo",todoRoutes);
// server.addService((personProto.TodoServiceInFuture as ServiceClientConstructor).service, { 
//     addTodo: addTodo,
//     getTodoByName: getTodoByName
// });


// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => { // localhost:50051
    server.start();
});


// .proto file usecase you can add in postman and get all the metionds and you can auto generate client for all languages 

// but what about proper types - @grpc/proto-loader give you script that help you create types
// node node_modules/@grpc/proto-loader/build/bin/groto-loader-gen-types.js 
// so via this script you can create types for your .proto file 
// ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js  --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=generated ./src/a.proto