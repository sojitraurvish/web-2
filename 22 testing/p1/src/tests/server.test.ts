import {describe, expect, it } from "@jest/globals"
import {multiply, sum} from "../server"

describe("Testing a sum function",()=>{
    
    it("should sum 1 and 2 correctly",()=>{
        const finalAnswer=sum(1,2)
        expect(finalAnswer).toBe(3)
    })

    it("should retun the sum of negative numbers correctly",()=>{
        const finalAnswer=sum(-1,-2);
        expect(finalAnswer).toBe(-3)
    })
})

describe("Testing multiply function",()=>{
    it("should multipley 3 and 2 correctly",()=>{
        const finalAnswer=multiply(3,2);
        expect(finalAnswer).toBe(6)
    })
})


// you get sturctored out put 
// describe("Testing all the calculator functionality",()=>{
//     describe("Testing a sum function",()=>{
        
//         it("should sum 1 and 2 correctly",()=>{
//             const finalAnswer=sum(1,2)
//             expect(finalAnswer).toBe(3)
//         })
    
//         it("should retun the sum of negative numbers correctly",()=>{
//             const finalAnswer=sum(-1,-2);
//             expect(finalAnswer).toBe(-3)
//         })
//     })
    
//     describe("Testing multiply function",()=>{
//         it("should multipley 3 and 2 correctly",()=>{
//             const finalAnswer=multiply(3,2);
//             expect(finalAnswer).toBe(6)
//         })
//     })

// })