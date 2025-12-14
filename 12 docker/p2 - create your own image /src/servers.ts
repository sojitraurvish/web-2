import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()

const PORT=process.env.PORT || 3000

const server=app.listen(PORT,()=>{
    console.log(`Server is running in ${process.env.NODE_ENV}${process.env.DB_URI} mode on port ${PORT}`)
})
 
// Handle unhandled promise rejections
process.on("unhandledRejection",(error:Error,promise:Promise<void>)=>{
    console.log(`UnhandledRejection Error: ${error.message}`)
    server.close(()=>{
        process.exit(1)
    })
})
