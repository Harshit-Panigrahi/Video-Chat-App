const express = require("express");
const app = express();
const server = require("http").Server(app);

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "harshit.whitehat@gmail.com",
    pass: "sdrckwcdvrbwgcgh",
  },
  secure: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, { cors: { origin: "*" } });

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true });
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.post("/send-mail", (req, res) => {
  const to = req.body.to;
  const url = req.body.url;
  const mailData = {
    from: "harshit.whitehat@gmail.com",
    to: to,
    subject: "Requesting you to join video chat",
    html: `<p>Hey there,</p><p>Please join me for a video chat: ${url}</p>`,
  };
  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      return console.log(err);
    }
    res.status(200).send({
      msg: "Invitation successfully sent",
      msgId: info.messageId,
    });
    console.log("Post request send successfully! ");
  });
});

app.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, username) => {
    socket.join(roomId);
    io.to(roomId).emit("user-connected", userId);
    socket.on("message", (msg) => {
      io.to(roomId).emit("createMessage", msg, username);
    });
  });
});

server.listen(process.env.PORT || 3030);
