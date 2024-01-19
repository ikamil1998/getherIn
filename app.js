"use strict";
const path = require("path");
const express = require("express");
const { sequelize } = require("./models");
const socketIO = require("socket.io");
const http = require("http");
require("dotenv").config()

// ? for in app purchase

// const sequelize = require("./utils/database");

const authRoutes = require("./routes/auth");
const rootRoutes = require("./routes/root");
const departmentRoutes = require("./routes/department");
const groupRoutes = require("./routes/group");
const packageRoutes = require("./routes/package");
const resultRoutes = require("./routes/result");
const notificationRoutes = require("./routes/notification");
const questionRoutes = require("./routes/question");
const answerRoutes = require("./routes/answer");
const dashboardRoutes = require("./routes/dashboard");
const ComplaintRoutes = require("./routes/complaint");
const ChatComplaintRoutes = require("./routes/chatComplaint");
const IAPRoutes = require("./routes/IAP");
const achievementCartRoutes = require("./routes/achievementCart.js");
const achievementsRoutes = require("./routes/achievement.js");
const imagesRoutes = require("./routes/image.js");
const { changeValidForConsumerPackage } = require("./utils");

const app = express();

const winston = require('winston')
const consoleTransport = new winston.transports.Console()
const myWinstonOptions = {
  transports: [consoleTransport]
}
// const logger = new winston.createLogger(myWinstonOptions)

// function logRequest(req, res, next) {
//   logger.info(req.url)
//   next()
// }
// app.use(logRequest)

// function logError(err, req, res, next) {
//   logger.error(err)
//   next()
// }
// app.use(logError)

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 8080;

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/files", express.static(path.join(__dirname, "files")));

// app.use(express.urlencoded()); // x-www-form-urlencoded <form>
// app.use(express.json()); // application/json
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/department", departmentRoutes);
app.use("/group", groupRoutes);
app.use("/package", packageRoutes);
app.use("/result", resultRoutes);
app.use("/notification", notificationRoutes);
app.use("/question", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/complaint", ComplaintRoutes);
app.use("/chatComplaint", ChatComplaintRoutes);
app.use("/iap", IAPRoutes);
app.use("/achievments_cart", achievementCartRoutes);
app.use("/achievments", achievementsRoutes);
app.use("/image", imagesRoutes);
app.use("/", rootRoutes);

require("./socket/groupChat.js")(io);
require("./socket/privateChat.js")(io);
// ! some router
app.get("/test",(req,res)=>{
  io.to(1).emit('test',"test")
  res.send("come soon")
})

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  console.log(error);
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    console.log(`connected DATABASE`);
    server.listen(PORT, () => console.log(`localhost:${PORT}`));
    // start work on validate consuemr server at 12pm
    var now = new Date();
    var millisTill12 =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      ) - now;
    if (millisTill12 < 0) {
      millisTill12 += 86400000; // it's after 10am, try 10am tomorrow.
    }
    let timer1, timer2;
    timer1 = setTimeout(() => {
      timer2 = setInterval(changeValidForConsumerPackage, 86400000);
    }, millisTill12);
    // server.close(() => {
    //   clearInterval(timer1);
    //   clearInterval(timer2);
    // });
  })
  .catch((err) => {
    console.log(err);
  });



exports.io=io
