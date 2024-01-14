"use strict";
const { admin } = require('../utils/firebase-config')

const Model = require("../models");
const result = require("../models/result");
const {
  checkValidate,
  checkAdminAccunt,
  checkTeacherAccunt,
  isAccessProcess,
} = require("../utils");
exports.create = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    let { data, departmentId } = req.body;
    const result = await Model.Result.create({ departmentId })
    let tokens = []
    // data.forEach(async (item) => {
    for (const item of data) {
      const { feature_name, groups } = item
      const feature = await Model.Feature.create({ title: feature_name, resultId: result.id })
      // groups.forEach(async (i) => {
      for (const i of groups) {
        const { groupId, value } = i
        // console.log(value)
        await Model.Value.create({ groupId, value, featureId: feature.id })
      }
    }
    for(const i of data[0].groups){
      const group = await Model.Group.findByPk(i.groupId)
      const users = await Model.UserGroup.findAll({
        raw: true,
        where: { groupId: i.groupId },
        include: {
          model: Model.User,
          attributes: ["firebaseToken", "id"]
        }
      })
      let data = users.map((item) => item["User.firebaseToken"]);
      let uniqueData = data.filter((item, i, ar) => ar.indexOf(item) === i);
      tokens = { ...tokens, ...uniqueData }
      for (const user of users) {
        await Model.Notification.create({
          title_ar: "نتيجة جديدة",
          title_en: `new result`,
          body_ar: `${group.name} نتيجة جديدة للمجموعة`,
          body_en: `new result for ${group.name}`,
          userId: user.userId,
        })
      }

    }
    for (const registrationToken of Object.values(tokens)) {
      if (registrationToken) {
        const message = {
          data: {
            body: "new Result",
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
    res.send("done");
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    checkValidate(req);
    // isAccessProcess();
    const { id } = req.params;
    const data = await Model.Result.findOne({ raw: true, where: { id } });
    // console.log(data);
    res.send("come soon");
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getByDeapartmentId = async (req, res, next) => {
  try {
    checkValidate(req);
    // isAccessProcess();
    const { id } = req.params;
    let data = await Model.Result.findAll({
      raw: true,
      where: { departmentId: id },
      attributes: ["id", "title", "object", "help", "createdAt"],
    });
    data = data.map((item) => {
      return {
        ...item,
        object: JSON.parse(item.object),
      };
    });
    const s = new Set();
    for (const index of data) {
      s.add(index.help);
    }
    const arr = new Array();
    for (const value of s) {
      console.log(value);
      let handle = data.filter((item) => item.help === value);
      const createdAt = handle[0].createdAt;
      console.log(createdAt);
      handle = data.map((item) => ({
        ...item,
        help: undefined,
        createdAt: undefined,
      }));
      arr.push({ data: handle, createdAt });
    }
    res.send(arr);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getLastResultByDeapartmentId = async (req, res, next) => {
  try {
    checkValidate(req);
    // isAccessProcess();
    const { id } = req.params;
    let result = await Model.Result.findOne({
      where: { departmentId: id },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "departmentId", "createdAt"],
      include: {
        model: Model.Feature,
        attributes: ["id", "title"],
        include: {
          model: Model.Value,
          attributes: ["value", "groupId"],
          include: {
            model: Model.Group,
            attributes: ["name", "id"],
          }
        }
      }
    });
    if (result) {
      let Groups = [], ids = []
      result.Features.forEach(item => {
        const { title, Values } = item
        Values.forEach(item => {
          const { value, Group } = item
          const { name, id } = Group
          Groups.push({ feature: title, value: value, name, id })
          ids.push(id)
        })
        // console.log(item.dataValues)
      })
      let uniqueData = ids.filter((item, i, ar) => ar.indexOf(item) === i);
      let final = []
      uniqueData.forEach(i => {
        const data = Groups.filter(item => item.id === i)
        const { id, name } = data[0]
        let totalMarks = 0
        const features = data.map(item => {
          totalMarks += parseInt(item.value)
          return { featureName: item.feature, featureMark: item.value }
        })
        final.push({ id, name, features, totalMarks })
      })
      // res.send(uniqueData)
      res.send(final)
    }
    else res.status(200).send([])
    //else res.status(400).send("don't have result")
    // data = data.map((item) => {
    //   return {
    //     ...item,
    //     object: JSON.parse(item.object),
    //   };
    // });
    // const s = new Set();
    // for (const index of data) {
    //   s.add(index.help);
    // }
    // const arr = new Array();
    // for (const value of s) {
    //   console.log(value);
    //   let handle = data.filter((item) => item.help === value);
    //   const createdAt = handle[0].createdAt;
    //   console.log(createdAt);
    //   handle = data.map((item) => ({
    //     ...item,
    //     help: undefined,
    //     createdAt: undefined,
    //   }));
    //   arr.push({ data: handle, createdAt });
    // }
    // res.send(arr[0]);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    checkValidate(req);
    // isAccessProcess();
    const packages = await Model.Package.findAll({
      raw: true,
      attributes: [
        "name",
        "price",
        "number_of_department",
        "number_of_group",
        "expiry",
        "id",
      ],
    });
    res.status(200).json({ ...packages });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
