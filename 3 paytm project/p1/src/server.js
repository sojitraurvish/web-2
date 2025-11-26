  import express from "express";

  const app = express();

  app.use(express.json());
// to versioning your apis
  app.use("/api/v1",router);  

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
  
  