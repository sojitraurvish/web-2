import express from "express";
import { signup, courses } from "../controllers/admin.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/courses", courses);

export { router as adminRoutes };