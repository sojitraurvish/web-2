import path from 'path';
import * as grpc from '@grpc/grpc-js';// as like http grpc is also one protocol
import  { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, './a.proto'));//parse your proto file

const personProto = grpc.loadPackageDefinition(packageDefinition);//load your proto file defination



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

//@ts-ignore
// call == request , callback == response
function addPerson(call, callback) { 
  console.log(call)
    let person = {
      name: call.request.name,
      age: call.request.age
    }
    PERSONS.push(person);
    // here i do not have to write any compression logic grpc does it innner the hood by using proto buffs this is why people use it
    callback(null, person);//null == error, person == response
}

//@ts-ignore
function getPersonByName(call, callback) {
    console.log(call)
    const person = PERSONS.find(p => p.name === call.request.name);
    callback(null, person);
}

// app.use("/api/v1/user",userRoutes);
server.addService((personProto.AddressBookService as ServiceClientConstructor).service, { 
    addPerson: addPerson, 
    getPersonByName: getPersonByName 
});
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


