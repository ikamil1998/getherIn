"use strict";
const { Op } = require("sequelize");

const {
  Department,
  User,
  Group,
  ConsumerPackage,
  Achievements,
} = require("../models");
const Model = require("../models");
const {
  checkValidate,
  checkTeacherAccunt,
  isAccessProcess,
  makeCodeCode,
} = require("../utils");
const { admin } = require("../utils/firebase-config");
const { data } = require("../validations/package");
// * done
const ITEMS_PER_PAGE = 10;

exports.get = async (req, res, next) => {
  try {
    const userId = req.tokenUserId;
    checkValidate(req);
    const { id } = req.params;
    const department = await Department.findOne({
      where: { id },
      attributes: ["id", "name", "code", "url"],
      include: [
        // {
        //   model: User,
        //   attributes: ["email"],
        //   where:{''}
        // },
        {
          model: Group,
          attributes: ["name", "id"],
        },
      ],
    });
    if (department) {
      const isValid = await isAccessProcess("department", id);
      let data = [];
      if (isValid) {
        const users = await Model.UserDepartment.findAndCountAll({
          where: { departmentId: department.id },
        });
        for (let group of department.dataValues.Groups) {
          const users_group = await Model.UserGroup.findAndCountAll({
            where: { groupId: group.dataValues.id },
          });
          data.push({
            id: group.dataValues.id,
            name: group.dataValues.name,
            members_count: users_group.count,
          });
        }
        const achieve = await Model.AchievementDepartment.findOne({
          where: { departmentId: id },
          include: [
            {
              model: Model.Achievements,
              where: {
                userId,
                view: {
                  [Op.in]: [2, 3],
                },
              },
            },
          ],
        });

        res.status(200).json({
          id: department.dataValues.id,
          name: department.dataValues.name,
          code: department.dataValues.code,
          url: department.dataValues.url,
          members_count: users.count,
          Groups: data,
          shared: achieve ? true : false,
          achievmentId: achieve ? achieve.achievmentId : null,
        });
      } else {
        const err = new Error(
          "Your package has expired, you must renew the package "
        );
        err.statusCode = 403;
        throw err;
      }
    } else {
      const err = new Error("Department is not exists");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.getAll = async (req, res, next) => {
  try {
    if (req.tokenUserKind === "student") {
      const departments = await Model.UserDepartment.findAll({
        raw: true,
        where: { userId: req.tokenUserId },
        attributes: ["departmentId", "id", "userId"],
      });
      const data = [];
      for (const item of departments) {
        // const user = await Model.User.findOne({
        //   raw: true,
        //   where: { id: item.userId },
        // });
        const handle = await Model.Department.findAll({
          // raw: true,
          where: { id: item.departmentId },
          attributes: ["name", "code", "id", "url"],
          include: [
            {
              model: Model.Group,
              attributes: ["id", "name"],
            },
            {
              model: Model.User,
              attributes: ["id", "picture", "email", "fullName"],
              // where: { id: item.userId },
            },
          ],
        });
        console.log(handle);
        data.push(handle[0]);
      }
      res.status(200).send(data);
    } else if (req.tokenUserKind === "teacher") {
      let container = [];
      const data = await Model.Department.findAll({
        // raw: true,
        where: { userId: req.tokenUserId },
        attributes: ["name", "code", "id", "url"],
        include: {
          model: Model.Group,
          attributes: ["id", "name"],
        },
      });
      for (let department of data) {
        const users = await Model.UserDepartment.findAndCountAll({
          where: { departmentId: department.id },
        });
        container.push({ ...department.dataValues, user_counter: users.count });
      }
      res.status(200).send(container);
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.create = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const isValid = await isAccessProcess("create", req.tokenUserId);
    if (isValid) {
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
      // console.log(cpData.current_number_of_department);
      if (cpData.current_number_of_department < pData.number_of_department) {
        let code = req.body.code;
        const name = req.body.name;
        if (!code) {
          code = makeCodeCode(6);
          while (1) {
            const dep1 = await Department.findOne({ where: { code } });
            if (!dep1) {
              break;
            }
          }
        } else {
          const re = new RegExp("^[A-Z0-9]+(?:List)?$");
          if (!re.test(code)) {
            const err = new Error(
              "department must has must be include capital Letter and number only"
            );
            err.statusCode = 409;
            throw err;
          }
          const dep = await Department.findOne({ where: { code } });
          if (dep) {
            const err = new Error("department code exist");
            err.statusCode = 409;
            throw err;
          }
        }
        const department = await Department.create({
          name,
          code,
          url: `https://www.gatherin.me/${code}`,
          userId: req.tokenUserId,
        });
        await Model.UserDepartment.create({
          userId: req.tokenUserId,
          departmentId: department.id,
        });
        await Model.ConsumerPackage.update(
          {
            current_number_of_department:
              cpData.current_number_of_department + 1,
          },
          { where: { userId: req.tokenUserId } }
        );
        res.status(200).json({
          ...department.dataValues,
          createdAt: undefined,
          updatedAt: undefined,
        });
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
      throw err;
    }
  } catch (err) {
    if (
      typeof err.data === "object" &&
      (err.data[0].msg === "code must be capital letters and numbers." ||
        err.data[0].msg === "يجب أن يكون الرمز أحرفًا وأرقامًا كبيرة")
    )
      err.statusCode = 422;
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.update = async (req, res, next) => {
  try {
    checkValidate(req);
    const { id, name, code } = req.body;
    isAccessProcess("department", id);
    const department = await Model.Department.findOne({ where: { id: id } });
    if (code) {
      const re = new RegExp("^[A-Z0-9]+(?:List)?$");
      if (!re.test(code)) {
        const error = new Error("code must be capital letters and numbers.");
        error.statusCode = 400;
        throw error;
      }
      const data = await Model.Department.findOne({
        where: { code, id: { value: { [Op.ne]: id } } },
      });
      if (data) {
        const error = new Error(
          "you can't choose this code because it's exist"
        );
        error.statusCode = 400;
        throw error;
      }
      department.code = code;
    }
    if (name) {
      const data = await Model.Department.findOne({
        where: { name, userId: req.tokenUserId },
      });
      if (data) {
        const error = new Error(
          "you can't choose this name because it's exist"
        );
        error.statusCode = 400;
        throw error;
      }
      department.name = name;
    }
    department.save();
    res.send("successfully processed");
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.delete = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't deleted by student account");
    // isAccessProcess("department", id);
    const { id } = req.body;
    const deaprtment = await Model.Department.findOne({
      where: { id },
      include: { model: Model.Group },
    });
    await Model.Department.destroy({
      where: { id, userId: req.tokenUserId },
    });
    await Model.ConsumerPackage.findOne({
      where: { userId: req.tokenUserId },
    }).then((cp) =>
      cp.update({
        current_number_of_department: cp.current_number_of_department - 1,
        current_number_of_group:
          cp.current_number_of_group - deaprtment.dataValues.Groups.length,
      })
    );
    res.status(200).json({ messgae: "successfully deleted department" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.addUser = async (req, res, next) => {
  try {
    checkValidate(req);
    if (req.tokenUserKind === "student") {
      const handle = await Model.UserDepartment.findOne({
        where: { userId: req.tokenUserId, departmentId: req.departmentId },
      });
      if (!handle) {
        const department = await Model.Department.findOne({
          where: { id: req.departmentId },
        });
        const data1 = await Model.ConsumerPackage.findOne({
          where: { userId: department.userId },
        });
        const data2 = await Model.Package.findOne({
          where: { id: data1.packageId },
        });
        console.log(department.number_of_student);
        if (department.number_of_student < data2.number_of_students) {
          department.number_of_student += 1;
          await department.save();
          await Model.UserDepartment.create({
            userId: req.tokenUserId,
            departmentId: req.departmentId,
          });
          const teacher = await Model.User.findOne({
            raw: true,
            where: { id: req.teacherId },
            attributes: ["firebaseToken"],
          });
          if (teacher.firebaseToken) {
            const message = {
              data: {
                body: "user Join",
                icon: "https://www.gatherin.me/files/2021-09-07T07:41:06.045Z-photo_2021-07-18_16-43-46.jpg",
                title: "new notification",
              },
              token: teacher.firebaseToken,
            };
            admin.messaging().send(message);
          }
          const data = {
            title_en: `join to department`,
            title_ar: `الانضمام الى القسم`,
            body_en: `the user with the email ${req.tokenEmail} joined the department ${req.body.code}`,
            body_ar:
              req.body.code +
              " أنضم الى القسم صاحب الكود " +
              req.tokenEmail +
              " المستخدم صاحب الأيميل",
            userId: req.teacherId,
          };
          await Model.Notification.create(data);
          res.status(200).json({ msg: "successfully" });
        } else {
          res.send({ msg: "department is full,so you can't join to it" }, 400);
        }
      } else {
        res.status(406).json({ msg: "user exist in department" });
      }
    } else {
      res.status(403).send("it's allow only for student");
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
// * done
exports.getUsersInDerpartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = +req.query.page || 1;
    const data = await Model.Department.findOne({ where: { id } });
    if (data) {
      const users = [];
      const userId = await Model.UserDepartment.findAll({
        // limit: ITEMS_PER_PAGE,
        // offset: (page - 1) * ITEMS_PER_PAGE,
        raw: true,
        where: { departmentId: id },
        attributes: ["userId", "id"],
      });
      const groups = await Model.Group.findAll({
        raw: true,
        where: { departmentId: id },
        attributes: ["id"],
      });
      const userCount = await Model.UserDepartment.findAndCountAll({
        where: { departmentId: id },
      });
      for (const index of userId) {
        const handle = await Model.User.findOne({
          raw: true,
          where: { id: index.userId },
          attributes: ["fullName", "picture", "email", "id"],
        });
        let isJoin = false;
        for (let group of groups) {
          const result = await Model.UserGroup.findOne({
            where: { userId: handle.id, groupId: group.id },
          });
          console.log(result);
          if (result) {
            isJoin = true;
            break;
          }
        }
        users.push({ ...handle, isJoin });
      }
      res.status(200).json({
        member: users,
        members_count: userCount.count,
        currentPage: page,
        // hasNextPage: ITEMS_PER_PAGE * page < userCount.count,
        hasNextPage: false,
        hasPreviousPage: page > 1,
        nextPage: ITEMS_PER_PAGE * page < userCount.count ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        lastPage: Math.ceil(userCount.count / ITEMS_PER_PAGE),
      });
      // res.status(200).send(users);
    } else {
      const err = new Error("Department is not exist");
      err.statusCode = 400;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
//  ! done
exports.removeUser = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const { departmentId, users } = req.body;

    const handle = await Model.Department.findOne({
      where: { userId: req.tokenUserId, id: departmentId },
    });
    if (users.indexOf(req.tokenUserId) !== -1) {
      const err = new Error("you can't delete teacher from departemt");
      err.statusCode = 400;
      throw err;
    }
    if (handle) {
      for (let user of users) {
        const data = await Model.UserDepartment.findOne({
          where: {
            userId: user,
            departmentId: handle.id,
          },
        });
        if (data) {
          const groups = await Model.Group.findAll({ where: { departmentId } });
          for (let group of groups) {
            await Model.UserGroup.destroy({
              where: { groupId: group.id, userId: user },
            });
          }
          await data.destroy();
          await Model.ConsumerPackage.findOne({
            where: { userId: req.tokenUserId },
          }).then((cp) => {
            cp.update({
              current_number_of_student: cp.current_number_of_student - 1,
            });
          });
        } else {
          const err = new Error("user not exist in deparment");
          err.statusCode = 400;
          throw err;
        }
      }
      res.status(200).json({ msg: "successfully" });
    } else {
      res
        .status(400)
        .json({ msg: "department is not for you , or department not exist" });
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.filterUsers = async (req, res, next) => {
  try {
    const { text, departmentId } = req.query;
    const page = +req.query.page || 1;
    if (departmentId) {
      const userCount = await Model.UserDepartment.findAndCountAll({
        where: { departmentId },
      });
      const groups = await Model.Group.findAll({
        raw: true,
        where: { departmentId: departmentId },
        attributes: ["id"],
      });

      const result = await Model.UserDepartment.findAll({
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
        where: {
          departmentId,
        },
        include: {
          model: Model.User,
          attributes: ["email", "id", "fullName", "picture", "phone"],
          where: {
            fullName: {
              [Op.like]: `%${text ? text : ""}%`,
            },
          },
        },
      });
      const users = [];
      const handle = result.map((item) => item.User.dataValues);
      for (let user of handle) {
        let isJoin = false;
        for (let group of groups) {
          const result = await Model.UserGroup.findOne({
            where: { userId: user.id, groupId: group.id },
          });
          console.log(result);
          if (result) {
            isJoin = true;
            break;
          }
        }
        users.push({ ...user, isJoin });
      }
      res.json({
        member: users,
        members_count: userCount.count,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < userCount.count,
        hasPreviousPage: page > 1,
        nextPage: ITEMS_PER_PAGE * page < userCount.count ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        lastPage: Math.ceil(userCount.count / ITEMS_PER_PAGE),
      });
    } else {
      const err = new Error("departmentId is not exist");
      err.statusCode = 400;

      throw err;
    }
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
