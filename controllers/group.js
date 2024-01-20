"use strict";

const { Op } = require("sequelize");
const { Department, Group, Package, Achievements } = require("../models");
const Model = require("../models");
const {
  checkValidate,
  checkTeacherAccunt,
  isAccessProcess,
} = require("../utils");
const { admin } = require("../utils/firebase-config");

// * done
const ITEMS_PER_PAGE = 10;

exports.getByDepartmentId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Model.Department.findOne({
      raw: true,
      where: { id },
      attributes: ["userId"],
    });
    if (department) {
      const user = await Model.User.findOne({
        raw: true,
        where: { id: department.userId },
        attributes: ["id", "fullName", "email", "picture"],
      });
      let groups = await Model.Group.findAll({
        raw: true,
        where: { departmentId: id },
        attributes: ["name", "id", "leader"],
      });
      const data = [];
      for (const item of groups) {
        const users = await Model.UserGroup.findAll({
          raw: true,
          where: { groupId: item.id },
        });
        const isValid = await users.filter((i) => {
          return i.userId === req.tokenUserId;
        });
        let Leader;
        if (item.leader)
          Leader = await Model.User.findOne({
            where: { id: item.leader },
            attributes: ["fullName", "email", "picture", "id"],
          });
        else Leader = null;
        data.push({
          ...item,
          leader: Leader,
          members_count: users.length,
          join: isValid.length > 0,
          master: user,
        });
      }
      res.status(200).send(data);
    } else {
      const err = new Error("department is not exist");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = +req.query.page || 1;

    const group = await Group.findOne({
      raw: true,
      where: { id },
      attributes: ["id", "name", "departmentId", "leader"],
    });
    if (group) {
      const isValid = await isAccessProcess("group", id);
      if (isValid) {
        const department = await Model.Department.findOne({
          where: { id: group.departmentId },
          include: [
            {
              model: Model.User,
              attributes: ["id", "fullName", "email", "picture"],
            },
          ],
        });
        const users = await Model.UserGroup.findAll({
          llimit: ITEMS_PER_PAGE,
          offset: (page - 1) * ITEMS_PER_PAGE,
          raw: true,
          where: { groupId: group.id },
        });
        const Users = [];
        for (let i of users) {
          const handel = await Model.User.findOne({
            raw: true,
            where: {
              id: i.userId,
            },
            attributes: ["fullName", "email", "picture", "id"],
          });
       
          const achievmentDep = await Model.AchievementDepartment.findOne({
            where: { departmentId: department.id },
            include: {
              model: Model.Achievments,
              where: {
                userId: handel.id,
                view: {
                  [Op.in]: [2, 3],
                },
              },
            },
          });
          
          console.log(achievmentDep);
          handel.hasPdf = achievmentDep ? true : false;
          handel.pdfLink = achievmentDep
            ? achievmentDep?.Achievment?.dataValues?.pdf
            : null;
          Users.push(handel);
        }
        const isJoin = await users.filter((i) => {
          return i.userId === req.tokenUserId;
        });
        let Leader;
        if (group.leader)
          Leader = await Model.User.findOne({
            where: { id: group.leader },
            attributes: ["fullName", "email", "id"],
          });
        else Leader = null;
        const userCount = await Model.UserGroup.count({
          where: { groupId: id },
        });
        res.status(200).json({
          ...group,
          join: isJoin !== null,
          master: department.User,
          members: Users,
          leader: Leader,
          members_count: userCount,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < userCount,
          hasPreviousPage: page > 1,
          nextPage: ITEMS_PER_PAGE * page < userCount ? page + 1 : null,
          previousPage: page > 1 ? page - 1 : null,
          lastPage: Math.ceil(userCount / ITEMS_PER_PAGE),
        });
      } else {
        const err = new Error(`your service is not valid now`);
        err.statusCode = 403;
        throw err;
      }
    } else {
      const err = new Error(`group is not exists`);
      err.statusCode = 403;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// ! done
exports.create = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const isValid = await isAccessProcess("create", req.tokenUserId);
    if (isValid) {
      const { name, departmentId, users } = req.body;
      const department = await Model.Department.findOne({
        raw: true,
        where: {
          userId: req.tokenUserId,
          id: departmentId,
        },
      });
      // console.log(department)
      if (department) {
        // throw new Error("hello");
        const cpData = await Model.ConsumerPackage.findOne({
          raw: true,
          where: { userId: req.tokenUserId },
          attributes: [
            "isValid",
            "current_number_of_department",
            "current_number_of_group",
            "packageId",
            "id",
          ],
        });
        const pData = await Model.Package.findOne({
          raw: true,
          where: { id: cpData.packageId },
          attributes: ["number_of_department", "number_of_group", "id"],
        });
        if (department.counter_groups < pData.number_of_group) {
          if (users && typeof users !== "object") {
            const err = new Error("users must by array");
            err.statusCode = 400;
            throw err;
          }
          // check users exist in department
          if (users) {
            const data1 = await Model.ConsumerPackage.findOne({
              where: {
                userId: req.tokenUserId,
              },
              include: [{ model: Model.Package }],
            });
            if (
              data1.Package.number_of_students / data1.Package.number_of_group +
                1 <
              users.length
            ) {
              const err = new Error(
                `you can add users less or equel then ${data1.Package.number_of_students} `
              );
              err.statusCode = 406;
              throw err;
            }
            // if()
            if (users.indexOf(req.tokenUserId) <= -1) {
              const err = new Error(`teacher id is not include in users`);
              err.statusCode = 400;
              throw err;
            }
            for (let userId of users) {
              const isValidUser = await Model.User.findOne({
                where: { id: userId },
              });
              if (!isValidUser) {
                // const err = new Error(`user has ID-${userId} doesn't exist`);
                const err = new Error(
                  `user has ID ${userId},who doesn't exist`
                );
                err.statusCode = 400;
                throw err;
              }
            }
          }
          const group = await Model.Group.create({
            name,
            departmentId,
            master: req.tokenUserId,
          });
          if (users) {
            for (let userId of users) {
              const user = await Model.User.findOne({
                raw: true,
                where: { id: userId },
                attributes: ["firebaseToken"],
              });
              if (user.firebaseToken) {
                const message = {
                  data: {
                    body: `you joined in ${name}`,
                    icon: "https://www.gatherin.me/files/2021-09-07T07:41:06.045Z-photo_2021-07-18_16-43-46.jpg",
                    title: "new notification",
                  },
                  token: user.firebaseToken,
                };
                // await   admin.messaging().send(message);
              }
              const data = {
                title_en: `join to group`,
                title_ar: `الانضمام الى المحموعة`,
                body_en: `you joined in group,that is ${name}`,
                body_ar: `لقد أنضممت الى المحموعة ${name}`,
                userId: userId,
              };
              await Model.Notification.create(data);
              Model.UserGroup.create({ groupId: group.id, userId });
            }
          }
          await Model.Department.update(
            {
              counter_groups: department.counter_groups + 1,
            },
            { where: { userId: req.tokenUserId, id: department.id } }
          );
          res.status(201).json({ ...group.dataValues });
        } else {
          const err = new Error("your package has been used");
          err.statusCode = 403;
          throw err;
        }
      } else {
        const err = new Error(
          "Your package has expired, you must renew the package "
        );
        err.statusCode = 403;
      }
    } else {
      const err = new Error("department is not for you");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.update = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const { groupId, name, users } = req.body;
    const group = await Model.Group.findByPk(groupId);
    if (group) {
      if (isAccessProcess("group", groupId)) {
        const isValidEdit = await Model.Department.findOne({
          where: { userId: req.tokenUserId, id: group.departmentId },
        });
        if (isValidEdit) {
          if (name) {
            const isSame = await Model.Group.findOne({
              where: { name, id: groupId },
            });
            if (!isSame) {
              const isValidName = await Model.Group.findOne({
                where: { name, departmentId: group.departmentId },
              });
              if (!isValidName) {
                group.name = name;
              } else {
                const err = new Error("name group exist");
                err.statusCode = 406;
                throw err;
              }
            }
          }
          if (users) {
            const data1 = await Model.ConsumerPackage.findOne({
              where: {
                userId: req.tokenUserId,
              },
              include: [{ model: Model.Package }],
            });
            if (
              data1.Package.number_of_students / data1.Package.number_of_group +
                1 <
              users.length
            ) {
              const err = new Error(
                `you can add number of users less or equel then ${data1.Package.number_of_students} `
              );
              err.statusCode = 406;
              throw err;
            }
            const usersExist = await Model.UserGroup.findAll({
              raw: true,
              where: { groupId },
              attributes: ["userId"],
            });
            // delete users
            for (let i of usersExist) {
              if (
                users.indexOf(i.userId) <= -1 &&
                i.userId != req.tokenUserId
              ) {
                const handle = await Model.UserGroup.findOne({
                  where: { groupId, userId: i.userId },
                });
                await handle.destroy();
                await Model.OptionGroup.destroy({
                  where: { groupId, userId: i.userId },
                });
              }
            }
            // add users
            for (let userId of users) {
              const handel = await Model.UserGroup.findOne({
                where: { userId, groupId },
              });

              if (!handel) {
                const user = await Model.User.findOne({
                  raw: true,
                  where: { id: userId },
                  attributes: ["firebaseToken"],
                });
                //console.log(user)
                if (user.firebaseToken) {
                  const message = {
                    data: {
                      body: `you joined in ${name}`,
                      icon: "https://www.gatherin.me/files/2021-09-07T07:41:06.045Z-photo_2021-07-18_16-43-46.jpg",
                      title: "new notification",
                    },
                    token: user.firebaseToken,
                  };
                  //       await admin.messaging().send(message);
                }
                const data = {
                  title_en: `join to group`,
                  title_ar: `الانضمام الى المحموعة`,
                  body_en: `you joined in group,that is ${name}`,
                  body_ar: `لقد أنضممت الى المحموعة ${name}`,
                  userId: userId,
                };
                await Model.Notification.create(data);
                await Model.UserGroup.create({ groupId, userId });
                const options = await Model.OptionGroup.findAll({
                  raw: true,
                  where: { groupId },
                  attributes: ["optionId"],
                });
                for (const i of options) {
                  await Model.OptionGroup.create({
                    groupId,
                    userId,
                    optionId: i.optionId,
                    selected: 0,
                  });
                }
              }
            }
          }
          group.save();
          res.status(200).json("done");
        } else {
          const err = new Error("you have not group");
          err.statusCode = 403;
          throw err;
        }
      } else {
        const err = new Error("your package is expired finished");
        err.statusCode = 403;
        throw err;
      }
    } else {
      const err = new Error("Group doesn't exist");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't deleted by student account");
    const { id } = req.body;
    // isAccessProcess("group", id);
    const group = await Model.Group.findOne({
      where: { id },
    });
    await Model.Department.findOne({
      where: { userId: req.tokenUserId, id: group.dataValues.departmentId },
    }).then((department) =>
      department.update({
        counter_groups: department.counter_groups - 1,
      })
    );
    await group.destroy();
    res.status(200).json({ messgae: "successfully deleted group" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.addUsers = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const { groupId, users } = req.body;
    const isValidGroup = await Model.Group.findOne({
      raw: true,
      where: { id: groupId },
      attributes: ["departmentId", "id"],
    });
    if (isValidGroup) {
      try {
        const isValidDepartment = await Model.Department.findOne({
          raw: true,
          where: { id: isValidGroup.departmentId, userId: req.tokenUserId },
        });
        // console.log(isValidDepartment);
        if (isValidDepartment) {
          for (let userId of users) {
            const isValidUser = await Model.User.findOne({
              where: { id: userId },
            });
            if (isValidUser) {
              const handle = await Model.UserGroup.findOne({
                where: {
                  groupId,
                  userId,
                },
              });
              if (!handle) Model.UserGroup.create({ groupId, userId });
              const options = await Model.OptionGroup.findAll({ groupId });
              for (const opiton of options)
                await Model.OptionGroup.create({
                  userId: userId,
                  selected: false,
                  optionId: opiton.id,
                  groupId,
                });
            } else {
              // const err = new Error(`user has ID-${userId} doesn't exist`);
              const err = new Error(`user has ID ${userId},who doesn't exist`);
              err.statusCode = 400;
              throw err;
            }
          }
        } else {
          const err = new Error("you don't have group");
          err.statusCode = 403;
          throw err;
        }
        res.json({ message: "successfully" });
      } catch (err) {
        throw err;
      }
    } else {
      const err = new Error("Group doesn't exist");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.deleteUsers = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const { users, groupId } = req.body;
    const isValidGroup = await Model.Group.findOne({
      where: { id: groupId },
    });
    if (isValidGroup) {
      try {
        for (let userId of users) {
          const isValidUser = await Model.User.findOne({
            where: { id: userId },
          });
          if (isValidUser) {
            if (userId === isValidGroup.leader) {
              isValidGroup.leader = null;
              isValidGroup.save();
            }
            const handle = await Model.UserGroup.findOne({
              where: {
                groupId,
                userId,
              },
            });
            if (handle) await handle.destroy();
          } else {
            const err = new Error("user doesn't exist");
            err.statusCode = 400;
            throw err;
          }
        }
        res.json({ message: "successfully" });
      } catch (err) {
        throw err;
      }
    } else {
      const err = new Error("Group doesn't exist");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.changeLeader = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    req.group.leader = req.body.leader_id;
    req.group.save();
    res.status(200).send(req.group);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    checkValidate(req);
    const UserDepartment = await Model.UserDepartment.findAll({
      where: { userId: req.tokenUserId },
    });
    let data = [];
    for (const i of UserDepartment) {
      let groups = await Model.Group.findAll({
        raw: true,
        where: { departmentId: i.departmentId },
        include: {
          model: Model.Department,
          attributes: ["name"],
        },
      });
      data.push(...groups);
    }
    let data1 = [];
    for (const item of data) {
      let handle = null;
      const qg = await Model.QuestionGroup.findOne({
        where: { groupId: item.id },
        order: [["createdAt", "DESC"]],
      });
      qg && console.log(qg.questionId);
      if (qg)
        handle = await Model.Answer.findOne({
          where: { groupId: item.id, questionId: qg.questionId },
        });
      const isAnswer = handle ? true : false;
      let leader = null,
        master = null;
      if (item.leader)
        leader = await Model.User.findOne({
          where: { id: item.leader },
          attributes: ["email", "fullName", "id", "picture"],
        });
      if (item.master)
        master = await Model.User.findOne({
          where: { id: item.master },
          attributes: ["email", "fullName", "id", "picture"],
        });
      data1.push({ ...item, isAnswer, leader, master });
    }

    res.status(200).send(data1);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.GetLastQuestion = async (req, res, next) => {
  try {
    checkValidate(req);
    const { id } = req.params;
    const data = await Model.Chat.findAll({
      where: { room: id, type: { [Op.eq]: "question" } },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "type", "createdAt"],
      include: {
        model: Model.Question,
        attributes: ["body", "type", "id"],
        require: false,
        include: {
          model: Model.Option,
          attributes: ["body", "id"],
          include: {
            model: Model.OptionGroup,
            attributes: ["optionId", "userId", "selected", "groupId", "id"],
          },
        },
      },
    });
    const handle = data.map((item) => {
      if (item.dataValues.type === "question") {
        const { id, body, type, Options } = item.dataValues.Question.dataValues;
        console.log(item.dataValues);
        const options = [];
        for (const item of Options) {
          const { body, OptionGroups } = item.dataValues;
          let counter = 0,
            handelSelected = false,
            id = null;
          for (const OptionGroup of OptionGroups) {
            id = OptionGroup.dataValues.optionId;
            const { selected, userId } = OptionGroup.dataValues;
            if (selected) counter++;
            if (userId === req.tokenUserId && selected) handelSelected = true;
          }
          options.push({ body, counter, selected: handelSelected, id });
        }
        // console.log(Options)
        if (options.length)
          return { ...item.dataValues, Question: { id, type, body, options } };
        else return { ...item.dataValues, Question: { id, type, body } };
      } else return item;
    });
    res.status(200).send(handle[0]);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
