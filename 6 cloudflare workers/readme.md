https://projects.100xdevs.com/tracks/eooSv7lnuwBO6wl9YA5w/serverless-1

// to create brand new project
npm create cloudflare -- my-app

how to depoloy your cloudfare workers on cloudflare

// wranglar is a cli
// first you have to login to cloudflare and push your code 
npx wranglar login


// to deploy - it automatically deploy because it has access to my acc
// npm run deploy 

// via this above command it upload my code on cloud and give me url via i can access my endpoints - on my cloudflare account

// if i change name in wrangler.jsonc file and then deploy then i will have two workers running

-----------------------------------

Tired of rewriting your backend for every cloud's serverless functions? 😩

Discovered @honojs—write your endpoints once in an Express-style API with Hono and deploy it to ANY provider (AWS, Cloudflare, Deno, etc.) without changing code.

// to create a hono app
// npm create hono@latest hono-app


if you want to deploy your next js app on server all around the world the use cloudflre workes, if user hits the server then they get to the closest age server