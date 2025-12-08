instead of publishing on npm registroy you get sturcture where you can write all you paackages and can import locall 

turborepo or lerna.js is fremework let you create monorepo

// for example 
github.com/calcom/cal.com/tree/main/packages/ui

https://turborepo.com/docs/getting-started/installation#start-with-an-example

// 
// npx create-turbo@latest

```text
apps
- apps/docs
- apps/web
packages
- packages/eslint-config-custom
- packages/tsconfig  // seperate package for all the tsconfigs
- packages/ui // all the ui componnents to reuse
``` 

// npm i
at root //npm run dev -> it will serve both docs and web both the folders

if you create new project in apps the make sure you import this in package.json file to reuse the ui package- and you can only import in your new porject if you have in package.json
 "dependencies": {
    "@repo/ui": "*",

you can also install new package in to ui package
 go to packages/ui and install mui or any thing which you want

 whenever you crete new compoenet in ui and if you want it use it in any app in apps folder then you have to export that package form here top level index.ts file - but i think here we have new vesion of turbo or monorepo so we do not have that file many be 

 so you can use this component to your multiple apps inside apps folder

 // in root package.json file
 
  "workspaces": [
    "apps/*",
    "packages/*"
  ]