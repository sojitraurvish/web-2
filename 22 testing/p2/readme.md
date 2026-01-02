// to test the httpserves we have to use libray called supertest
// pnpm i -D ts-jest @jest/globals @types/express @types/supertest
// pnpm i supertest express

// init.. jest config file
npx ts-jest config:init

unit testing - you do not start/connect to databases
integrations testing - you do coonect to databases
end to end testing - actully start a browser while testing

unit test does not check db logic , so how can you mock the database req and you can do it with jest 
but vetest makes it easy so we are shifting to @jest/globals to vitest so you just need to change the library name