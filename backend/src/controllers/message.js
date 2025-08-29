import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../config/cloudConfig.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getSidebarUsers = async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password");
  res.status(200).json(filteredUsers);
};

export const getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });
  res.status(200).json(messages);
};

export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    const uploadResult = await cloudinary.uploader.upload(image);
    imageUrl = uploadResult.secure_url;
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  // socket.io
  const receiverSocketId = getReceiverSocketId(receiverId);
  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage);
  }
  res.status(201).json(newMessage);
}

async function query(data) {
  const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
		headers: {
			Authorization: `Bearer ${process.env.HF_TOKEN}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(data),
	});
	const result = await response.json();
	return result.choices[0].message.content;
}

export const botReply = async (req,res) => {
  const { text, image } = req.body;
  const senderId = req.user._id;

  const result = await query({ 
    messages: [
        {
            role: "user",
            content: text,
        },
    ],
    model: "meta-llama/Llama-3.1-8B-Instruct:novita",
  });
  const botMessage = new Message({
      senderId: process.env.BOT_USER_ID,
      receiverId: senderId,
      text: result,
      isBot: true,
  });
  await botMessage.save();
  // socket.io
  const receiverSocketId = getReceiverSocketId(senderId);
  if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",botMessage);
  }
  res.status(201).json(botMessage);
  
}