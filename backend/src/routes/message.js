import express from "express";
import {isLoggedIn} from "../middlewares/auth.js";
import wrapAsync from "../utils/wrapAsync.js";
import { getSidebarUsers, getMessages, sendMessage, botReply} from "../controllers/message.js";

const router = express.Router();

router.get("/users",isLoggedIn,wrapAsync(getSidebarUsers));
router.get("/:id",isLoggedIn,wrapAsync(getMessages));

router.post("/send/chatbot", isLoggedIn, wrapAsync(botReply));
router.post("/send/:id", isLoggedIn, wrapAsync(sendMessage));

export default router;