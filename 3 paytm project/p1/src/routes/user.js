import { Router } from "express";
import { updateUser } from "../controllers/user.js";

const router = Router();

router.put("/", updateUser);

export { router as userRoutes };