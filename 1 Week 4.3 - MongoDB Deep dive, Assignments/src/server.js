import express from "express";
import { router } from "./routes/index.js";

const app = express();

app.use(express.json());

app.get("/",(req,res)=>{
  res.send("Hello World");
})

app.use("/api/v1",router)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});