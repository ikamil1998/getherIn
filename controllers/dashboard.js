'use strict'
const { Op, fn } = require('sequelize')
const sequelize = require('sequelize')
const Model = require('../models')
const {
    checkValidate
} = require("../utils")
const bcrypt = require('bcryptjs')
const ITEMS_PER_PAGE = 10;

exports.info = async (req, res, next) => {
    try {
        checkValidate(req)
        const counter1 = await Model.User.count()
        const counter2 = await Model.User.count({ where: { kind: 'student' } })
        const counter3 = await Model.User.count({ where: { kind: 'teacher' } })
        const counter4 = await Model.ConsumerPackage.count({ where: { packageId: 1 } })
        const counter5 = await Model.ConsumerPackage.count({ where: { packageId: 2 } })
        const counter6 = await Model.ConsumerPackage.count({ where: { packageId: { [Op.gt]: 2 } } })
        res.send({
            "number_of_users": counter1,
            "number_of_student": counter2,
            "number_of_teacher": counter3,
            "number_of_teacher_use_free_package": counter4,
            "number_of_teacher_use_grey_package": counter5,
            "number_of_teacher_use_gold_package_and_other": counter6,

        })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.setAbout = async (req, res, next) => {
    try {
        checkValidate(req)
        const { body_ar, body_en } = req.body
        await Model.About.destroy({ where: { id: { [Op.gte]: 0 } } })
        await Model.About.create({
            body_ar,
            body_en
        })
        res.send("done")
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.setPrivacy = async (req, res, next) => {
    try {
        checkValidate(req)
        const { body_ar, body_en } = req.body
        console.log(body_ar)
        await Model.Privacy.destroy({ where: { id: { [Op.gte]: 0 } } })
        await Model.Privacy.create({
            body_ar,
            body_en
        })
        res.send("done")
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.createAdmin = (req, res, next) => {
    checkValidate(req);
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.password;
    const kind = req.body.kind;
    bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
            Model.User.create({
                email,
                password: hashedPw,
                fullName,
                kind,
            }).then(async (user) => {
                res.status(200).json({
                    status: true,
                    ...user.dataValues,
                    password: undefined
                });
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteAdmin = async (req, res, next) => {
    try {
        checkValidate(req)
        const { id } = req.body
        const isValid = await Model.User.findOne({ where: { id, kind: "admin" } })
        if (isValid) {
            await Model.User.destroy({
                where: { id: id }
            })
            res.send(`done`)
        }
        else {
            res.status(400).send("id is wrong")
        }
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getTeacherInfo = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const totalItems = await Model.User.count({
            where: { kind: "teacher" },
        });
        const data = []
        let teacherData = await Model.User.findAll({
            raw: true
            , limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE
            , where: { kind: "teacher" }, attributes: ['id', 'email', 'fullName', 'kind', 'picture', 'phone']
        })
        for (const item of teacherData) {
            const departments = []
            const handle = await Model.ConsumerPackage.findOne({ raw: true, where: { userId: item.id }, include: { model: Model.Package, attributes: ['name',] } })
            console.log("test", handle)
            const h1 = await Model.Department.findAll({
                raw: true,
                where: { userId: item.id },
                attributes: ["id", 'name'],
            })
            for (const department of h1) {
                const countGroup = await Model.Group.findAndCountAll({ raw: true, where: { departmentId: department.id } })
                departments.push({ ...department, countGroup: countGroup.count })
            }
            data.push({
                ...item,
                current_number_of_department: handle.current_number_of_department,
                departments,
                // current_number_of_group: handle.current_number_of_group,
                // PackageName: handle['Package.name']
            })
            // console.log(handle)
        }
        res.send({
            data,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.createAccount = (req, res, next) => {
    checkValidate(req);
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.password;
    const kind = req.body.kind;
    bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
            Model.User.create({
                email,
                password: hashedPw,
                fullName,
                kind,
            }).then(async (user) => {
                res.status(200).json({
                    status: true,
                    ...user.dataValues,
                    password: undefined
                });
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteAccount = async (req, res, next) => {
    try {
        checkValidate(req)
        const { id } = req.body
        const isValid = await Model.User.findOne({ where: { id, kind: { [Op.ne]: "admin" } } })
        if (isValid) {
            await Model.User.destroy({
                where: { id: id }
            })
            res.send(`done`)
        }
        else {
            res.status(400).send("id is wrong")
        }
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getStudentsInfo = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const totalItems = await Model.User.count({
            where: { kind: "teacher" },
        });
        const data = []
        let studentData = await Model.User.findAll({
            raw: true,
            limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE
            ,
            where: { kind: "student" }, attributes: ['id', 'email', 'fullName', 'kind', 'picture', 'phone']
        })
        for (const item of studentData) {
            const countDepartment = await Model.UserDepartment.count({ where: { userId: item.id } })
            data.push({ ...item, countDepartment })
        }
        res.send({
            data,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getAdminsInfo = async (req, res, next) => {
    try {
        let adminData = await Model.User.findAll({ raw: true, where: { kind: "admin" }, attributes: ['id', 'email', 'fullName', 'kind', 'picture', 'phone'] })
        res.send(adminData)
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getUserInfo = async (req, res, next) => {
    try {
        const { id } = req.params
        const UserData = await Model.User.findOne({ raw: true, where: { id }, attributes: ['id', 'email', 'fullName', 'kind', 'picture', 'phone'] })
        if (UserData) {
            const Departments = await Model.UserDepartment.findAll({ where: { userId: id }, include: { model: Model.Department, attributes: ["id", "name"], include: { model: Model.Group, attributes: ['id', 'name'] } } })
            // res.send({...UserData,"departments":Departments["Departments"],Groups})
            res.send({
                ...UserData,
                "Departments": Departments.map(item => item['Department']),
            })
        }
        else res.status(400).send({ "msg": "user is not found" })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.deleteUser = async (req, res, next) => {
    try {
        const { departmentId, userId } = req.body;

        const data = await Model.UserDepartment.findOne({
            where: {
                userId: userId,
                departmentId: departmentId,
            }
        });
        if (data) {
            const groups = await Model.Group.findAll({ where: { departmentId } })
            for (let group of groups) {
                await Model.UserGroup.destroy({ where: { groupId: group.id, userId } })
            }
            await data.destroy()

        }
        else {
            const err = new Error("user not exist in deparment");
            err.statusCode = 400;
            throw err;

        }
        res.status(200).json({ msg: "successfully" });

    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.addUser = async (req, res, next) => {
    try {
        const { departmentId, email } = req.body;
        const user=await Model.User.findOne({where:{email}})
        if(user){
        await Model.UserDepartment.create({
            userId: user.id,
            departmentId: departmentId,
        });
        res.status(200).json({ msg: "successfully" });
    }else
    res.status(400).json({ msg: "user is not exist" });

    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getAllDepartment = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const totalDepartment = await Model.Department.count();
        let data = await Model.Department.findAll({
            limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE,
            include: {
                model: Model.User,
                attributes: ['id', 'email', 'fullName', 'kind', 'picture', 'phone']
            }
        })
        res.status(200).send({
            "count_departments": totalDepartment,
            "data": data,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalDepartment,
            hasPreviousPage: page > 1,
            nextPage: ITEMS_PER_PAGE * page < totalDepartment ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            lastPage: Math.ceil(totalDepartment / ITEMS_PER_PAGE),

        })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getAllDepartmentForUser = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const { userId } = req.params
        const totalDepartment = await Model.Department.count({ where: { userId } });
        let data = await Model.Department.findAll({
            limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE,
            where: { userId },
            include: {
                model: Model.User,
                attributes: ['id', 'email', 'fullName', 'kind', 'picture', 'phone']
            }
        })
        res.status(200).send({
            "count_departments": totalDepartment,
            "data": data,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalDepartment,
            hasPreviousPage: page > 1,
            nextPage: ITEMS_PER_PAGE * page < totalDepartment ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            lastPage: Math.ceil(totalDepartment / ITEMS_PER_PAGE),
        })
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getAllUserInDepartment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await Model.Department.findOne({ where: { id } });
        if (data) {
            const users = [];
            const userId = await Model.UserDepartment.findAll({
                raw: true,
                where: { departmentId: id },
                attributes: ["userId", "id"],
            });
            for (const index of userId) {
                const handle = await Model.User.findOne({
                    raw: true,
                    where: { id: index.userId },
                    attributes: ["fullName", "picture", "email", "id"],
                });
                users.push(handle);
            }
            res.status(200).json({
                "member": users,
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
