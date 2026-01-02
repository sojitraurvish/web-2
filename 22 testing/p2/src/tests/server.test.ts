import {describe, expect, it} from "@jest/globals"
import request from "supertest"
import {app} from "../server"

describe("POST /sum",()=>{
    it("should return the sum of two numbers",async ()=>{
        const res= await request(app).post("/sum").send({
            a:2,
            b:3
        })

        expect(res.statusCode).toBe(200)
        expect(res.body.result).toBe(5)
    })

    it("should return 411 if the input is invalid",async ()=>{
        const res= await request(app).post("/sum").send({
            a:"2",
            b:"3"
        })

        expect(res.statusCode).toBe(411)
        expect(res.body.error).toBe("Invalid input")
    })
})

// if you are sending data using header instead of body
// describe("POST /sum",()=>{
//     it("should return the sum of two numbers",async ()=>{
//         const res= await request(app).post("/sum").set({
//             a:"2",
//             b:"3"
//         })

//         expect(res.statusCode).toBe(200)
//         expect(res.body.result).toBe(5)
//     })
// })
