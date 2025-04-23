import express from "express";
import {isLoggedIn} from "../middlewares/auth.js";
import wrapAsync from "../utils/wrapAsync.js";
import { getSidebarUsers, getMessages, sendMessage } from "../controllers/message.js";

const router = express.Router();

router.get("/users",isLoggedIn,wrapAsync(getSidebarUsers));
router.get("/:id",isLoggedIn,wrapAsync(getMessages));

router.post("/send/:id", isLoggedIn, wrapAsync(sendMessage));

export default router;