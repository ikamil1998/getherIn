const Users = require("../utils/User");
const fs = require('fs')
const path = require('path')
const { getLastMessages } = require("../utils/chat");
const Model = require("../models");
module.exports = function (io) {
  const users = new Users();

  io.on("connection", (socket) => {
    socket.on("join", async (pm, callback) => {
      const room = parseInt(pm.room)
      const userID = parseInt(pm.userID)
      socket.join(parseInt(pm.room));

      users.AddUserData(socket.id, userID, room);
      // console.log(users.GetUsersList(pm.room))
      io.to(room).emit("usersList", users.GetUsersList(room));
      //   get last chat
      const messages = await getLastMessages(room, userID)
      socket.emit("lastChat", messages);
      if (callback) callback(true);
    });

    socket.on("sendMessage", async (data, callback) => {
      const {
        senderId,
        senderName,
        senderImage,
        type,
        msg,
        img,
        video,
        record
      } = data
      const room=parseInt(data.room)

      const handel=await Model.Chat.create({
        room,
        senderId,
        senderName,
        senderImage,
        type,
        msg,
        img,
        video,
        record,
      })
      io.to(room).emit("receiveMessage", {
        room,
        senderId,
        senderName,
        senderImage,
        type,
        msg,
        img,
        video,
        record,
        id:handel.id
      });
      if (callback) callback(200)
    }

    );
    socket.on("selectOption", async (res, callback)=>{
      // console.log(res)
      const { optionId, userId, groupId,questionId }=res
      const optionGroup=await Model.OptionGroup.findOne({ where: { optionId, userId, groupId}})
      if(optionGroup){
      optionGroup.selected=true
      optionGroup.save()
      io.to(parseInt(groupId)).emit("changeOption", { ...res, groupId: undefined, questionId})
      if(callback)callback(true)
      }
      else if(callback)callback(false)
    })
    socket.on("saveImage", async (image, callBack) => {
      const buffer = Buffer.from(image, 'base64');
      // console.log(path.join(process.cwd(), "/images"))
      fs.writeFile(path.join(process.cwd(), "/images/test.png"), buffer, (err) => {
        console.log(err)
      })
      if (callBack) {
        if (0)
          callBack(200)
        else callBack(400)
      }
    })
    socket.on("disconnect", () => {
      var user = users.RemoveUser(socket.id);

      if (user) {
        io.to(user.room).emit("usersList", users.GetUsersList(user.room));
      }
    });
  });
};
