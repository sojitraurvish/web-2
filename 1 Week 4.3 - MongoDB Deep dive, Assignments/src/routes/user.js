import express from "express";

const router = express.Router();

router.route("/user").post();

export { router as userRoutes };