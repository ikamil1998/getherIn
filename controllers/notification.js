// const { labels } = require("../intl");
const Model = require("../models");
const { checkValidate } = require('../utils')
const { admin } = require('../utils/firebase-config')
// !edit
const ITEMS_PER_PAGE = 10;
exports.getWithPg = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const totalItems = await Model.Notification.count({
      where: { userId: req.tokenUserId },
    });
    const count_un_seen = await Model.Notification.count({
      where: { userId: req.tokenUserId, status: 0 },
    });
    const notifications = await Model.Notification.findAll({
      where: { userId: req.tokenUserId },
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      order: [["status", "ASC"],["createdAt","DESC"]],
    });
    const data = {
      notifications,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      count_un_seen,
    };
    res.send(data);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const count_un_seen = await Model.Notification.count({
      where: { userId: req.tokenUserId, status: 0 },
    });
    const notifications = await Model.Notification.findAll({
      where: { userId: req.tokenUserId },
      order: [["status", "ASC"],["createdAt","DESC"]],
    });
    const data = {
      notifications,
      count_un_seen,
    };
    res.send(data);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.change = async (req, res, next) => {
  try {
    await Model.Notification.update(
      { status: 1 },
      { where: { userId: req.tokenUserId } }
    );
    res.send("done");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.send = async (req, res, next) => {
  try {
    checkValidate(req)
    const { body, groups } = req.body

    let tokens = [], usersId = []
    for (const i of groups) {
      const users = await Model.UserGroup.findAll({
        raw: true,
        where: { groupId: i },
        include: {
          model: Model.User,
          attributes: ["firebaseToken", "id"]
        }
      })
      let data = users.map((item) => item["User.firebaseToken"]);
      let uniqueData = data.filter((item, i, ar) => ar.indexOf(item) === i);
      tokens = { ...tokens, ...uniqueData }

      let data1 = users.map((item) => item["User.id"]);
      let uniqueData1 = data1.filter((item, i, ar) => ar.indexOf(item) === i);
      usersId = { ...usersId, ...uniqueData1 }

    }
    for (const userId of Object.values(usersId)) {
      if (userId) {
        await Model.Notification.create({
          title_ar: "اشعار جديد",
          title_en: "new notification",
          body_ar: body,
          body_en: body,
          userId: userId,
        })
      }
    }
    for (const registrationToken of Object.values(tokens)) {
      if (registrationToken) {
        const message = {
          data: {
            body,
icon: "https://www.gatherin.me/files/2021-09-07T07:41:06.045Z-photo_2021-07-18_16-43-46.jpg",
            title: "new notification"
          },
          token: registrationToken
        }
        // await Model.Notification.create({body_en:body,titlel_en:"notifiction",userId:})
        admin.messaging().send(message)
          .then((response) => {
            // Response is a message ID string.
            // console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
      }
    }
    res.send("done")
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}
