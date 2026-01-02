
// pnpm i -D vitest


There are two approaches to take when you add external services to your backend.
You can
1. Mock out the external service calls (unit tests).
2. Start the external services when the tests are running and stop them after the tests end (integration/end to end tests)

// right now we do unit tests so we mock out every db calles - so you do not need to take worry about actual db or connection 
url 

// pnpm i prisma
// npx prisma init

npx prisma migrate dev - this is not needed to do - to mingrate your schema 
npx prisma generate - client  prisma.some.create

// if you want to mock out redis then see pic 

in intigration test you need to make sure user has docker in there machien then you have to start db locally in user machine, then
have to updated it's connection string in your project and at the end you have to clear the docker container
eg cypress and playwrite - are fremework for end to end tests 