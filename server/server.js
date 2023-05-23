require("dotenv").config();
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const { dbConnect } = require("./config/dbConnect");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const next = require("next");
const { Server } = require("socket.io");

const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
server.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "'unsafe-eval'"],
      "img-src": ["'self'", "https: data:"],
    },
  })
);

dbConnect();
require("./config/cloudinaryConfig");

server.use("/api/user", require("./routes/userRoutes"));
server.use("/api/chats", require("./routes/chatRoutes"));
server.use("/api/messages", require("./routes/messageRoutes"));

app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

const appServer = server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

const io = new Server(appServer, {
  pingTimeout: 60000,
  cors: {
    origin: `http://localhost:3000`,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
});
