// const Users = require("../utils/User");
const fs = require('fs')
const path = require('path')
const { getLastMessagesPM } = require("../utils/chat");
const Model = require("../models");
module.exports = function (io) {
    // const users = new Users();

    io.on("connection", (socket) => {
        socket.on("join PM", async (pm, callback) => {
            socket.join(pm.room);
            console.log(pm.room)
            // users.AddUserData(socket.id, pm.userID, pm.room);
            // console.log(users.GetUsersList(pm.room))
            // io.to(pm.room).emit("usersList", users.GetUsersList(pm.room));
            //   get last chat
            const messages = await getLastMessagesPM(pm.room)
            socket.emit("lastChat PM", messages);
            if (callback) callback(true);
        });

        socket.on("sendMessage PM", async (data, callback) => {
            const {
                room,
                senderId,
                senderName,
                senderImage,
                type,
                msg,
                img,
                record,
                video
            } = data
            const reciverId = room.split('@').find(x => x != senderId)
            await Model.ChatPM.create({
                room,
                senderId,
                senderName,
                senderImage,
                type,
                msg,
                img,
                record,
                video,
                isRead: false,
                reciverId
            })
            io.to(room).emit("receiveMessage PM", {
                room,
                senderId,
                senderName,
                senderImage,
                type,
                msg,
                img,
                record,
                video
            });
            if (callback) callback(200)
        }

        );
        socket.on("disconnect", () => {
            // var user = users.RemoveUser(socket.id);

            // if (user) {
            //     io.to(user.room).emit("usersList", users.GetUsersList(user.room));
            // }
        });
    });
};
