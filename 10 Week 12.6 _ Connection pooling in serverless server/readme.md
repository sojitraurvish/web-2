https://projects.100xdevs.com/tracks/eooSv7lnuwBO6wl9YA5w/serverless-12

what is connection pooolition and how to do it

why does simple prisma projects does not work in serverless envaronment or cloudfare workers - you need to make some change to 
make it work with cloudflare workers
because your cloudflare have no of workes and your progress can only handle no of open connections not more than that so that 
connection pooling comes in picture 
so you create connection pool where your all the worker is connected and connection poll is conneted to db so you have to maintain
single connection to your database (see pic 1) for serverless applications

prisma it self provides connection pull 

