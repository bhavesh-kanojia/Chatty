import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.js";
import {isLoggedIn} from "../middlewares/auth.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

router.post("/signup", wrapAsync(signup));
router.post("/login", wrapAsync(login));
router.post("/logout", wrapAsync(logout));
router.put("/update-profile", isLoggedIn, wrapAsync(updateProfile));

router.get("/check",isLoggedIn,wrapAsync(checkAuth))

export default router;
