//open api sepc
// if you whant other plafrom can hit you backend directly at that time this it is needed

// so you want other people to look your docs and hit your endpoint not by seeing and figering out your code, so what if you can descrbe all these endpoint info in single file and give it to traders, because if you have spec file of your routes then you can always generate these routes of does as like binance and any other docs

// form open api spec you can create swagger and you have to use one libray that we used in the project
// and how to generate this spec file automatic  

// 1) using coments above to route
// 2) librayies with express - express-openapi 
      without express - tsoa library
// 3) hono - if you discribe properly with zod then i will generate open-api spec file automaticaly


// how to genearate client - or node js libray( functoin(){inside that i call api} and you just need to call this function vai cilent so kind of wrapper) using openapi spec file using openapi-typescript-codegen using this library

npx openapi-typescript-codegen --input ./spec.json --output ./generated
npx openapi-typescript-codegen --input ./spec.json<from this spec file> --output<generate library in this folder> ./generated

// you have to add base url before you generate spec file other wise this package will not work 
// this is how i can use it in diff project not in same project, and in diff project you have to copy this generated folder the you can use it
// import {DefaultRouter} from "../generated/index.ts";
// const response = await DefaultRouter.getUsers("1")