const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.get("/api", (req, res) => {
  res.send("API Ok");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server Stated om ${PORT}`);
});
