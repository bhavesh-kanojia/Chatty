import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app,server} from "./lib/socket.js"

import path from "path";

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "500kb" }));
app.use(cookieParser());
app.use(cors({
  origin : "http://localhost:5173",
  credentials: true
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  
  app.get("*",(req,res)=>{
    req.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

app.use((err, req, res, next) => {
  let { status = 500, message = "Internal Server Error" } = err;
  res.status(status).json({ message });
});

server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  connectDB();
});
