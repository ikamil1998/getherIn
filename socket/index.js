const socketIO = require("socket.io");
const {server}=require('../app')
exports.io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
