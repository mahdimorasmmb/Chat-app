const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
const colors = require("colors");
const userRouter = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("API Ok");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//---------------------------Deployment--------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Runnig Su");
  });
}

//-----------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`server Stated om ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to Soket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecived) => {
    let chat = newMessageRecived.chat;

    if (!chat.users) return console.log("chat.users undefin");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DIs");
    socket.leave(userData._id);
  });
});
