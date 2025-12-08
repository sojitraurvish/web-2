const signupInput= z.object({
    username:z.string(),
    password:z.string()
})

type SignupParams = z.infer<typeof signupInput>

// how code sharing used to happen when monorepos was not there - so you used to push your code to npm registory and other people used to pull from there and that is what we are doing right now - so we have to create our own libray that other people can use

// check harkirat code folder where there is frontend and backend in two diff folder so at both frontend and backend i have to decribe the typescirpt schema - what if i have to do that only once (reuseable code) that can be used at forntend as well as at the backend (single source of truth) 

// so here we decribe our command functions that both can use - so you do not directly import things from client to server and visa versa and that is why you need common folder to do that 

- but whatevrer you write here in common folder you have to export it from here 


// so create comman folder 
// pnpm init
// tsc --init

- so we first publish this local repo on npm js and then we use it in both the folders

// via cli do 
// npm login 

// with command name there are lot of pacakages and you have ot give unique name to your package so fisrt use your username and then add the package name as name in your package.json file
@urvish_sojitra_mine/common

// main in package.json represend your entry lavel so in our case our entry file is in dist/index.js
so add this - main : "dist/index.js"

Note - when you publish your js files then it is not recommendid to publish your ts files, and so people will not able to get the types
we see letter on how to fix that problem
but the rule of thumb is when you are publishing your package to npm you do not need to pushlish ts files only publish the js files it let your code safe

// then run - you can also create private packages as well but right now let's just go with public
npm publish --access=public 


// this command creates a folder and when you unzip it you can actually see what things goes to your package when you run or use above publish command
// npm pack -> before publishing you can check what things goes to the package when you publish
// open .

but you notic that it also sends the src folder which includes your ts file wich you do not want to send - how to do that

// add npmignore file
vi .npmignore


// to again publish 
npm publish - but you have to change the version 1.0.1 in package.json file

// now you can use it anywhere you want at frotend backend everywhere but you will get error if you import it in ts file and it ask you to install the types for that

.d.ts there this theired type of files called declarations files which includes only types for your package

but how to create this file 
go to your tsconfig.json file and write new key here 
"declaration":true - compile and see the dist folder
