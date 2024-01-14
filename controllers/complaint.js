"use strict";

const Models = require("../models");
const {
    checkValidate,
} = require("../utils");
const ITEMS_PER_PAGE = 10;

exports.create = async (req, res, next) => {
    try {
        checkValidate(req);
        const { message } =
            req.body;
        await Models.Complaint.create({
            userId: req.tokenUserId,
            message
        });
        // isAccessProcess();
        res.send({ msg: "successfully processed" });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.getByUserId = async (req, res, next) => {
    try {
        checkValidate(req);
        // isAccessProcess();
        const { id } = req.params;
        const user = await Models.User.findOne({ where: { id } })
        if (user) {
            const page = +req.query.page || 1;
            const totalItems = await Models.Complaint.count()

            const data = await Models.Complaint.findAll({
                limit: ITEMS_PER_PAGE,
                offset: (page - 1) * ITEMS_PER_PAGE,
                where: { userId: id },
                include: {
                    model: Models.User,
                    attributes: ['fullname', 'email', 'picture', "id", "phone"]
                }
            });
            res.send({
                total: totalItems,
                data,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
                previousPage: page > 1 ? page - 1 : null,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
            })
        } else {
            const error = new Error("User is not exist, id is not valid ")
            error.statusCode = 400;
            throw error

        }
        // console.log(data);
        res.send("come soon");
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.getAll = async (req, res, next) => {
    try {
        checkValidate(req);
        // isAccessProcess();
        const page = +req.query.page || 1;
        const totalItems = await Models.Complaint.count()
        const complaints = await Models.Complaint.findAll({
            limit: ITEMS_PER_PAGE,
            offset: (page - 1) * ITEMS_PER_PAGE,
            include: {
                model: Models.User,
                attributes: ['fullname', 'email', 'picture', "id", "phone"]
            }
        });
        res.status(200).send({
            total: totalItems,
            data: complaints,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: ITEMS_PER_PAGE * page < totalItems ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.update = async (req, res, next) => {
    try {
        // checkValidate(req);
        //   isAccessProcess();
        // const { id, name, price, expiry, number_of_department, number_of_group } =
        //     req.body;
        // await Model.Package.update({ name, price, expiry, number_of_department, number_of_group, number_of_students: 8 * number_of_group }, { where: { id } })
        res.send({ msg: 'come soon' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.delete = async (req, res, next) => {
    try {
        // checkValidate(req);
        // // checkTeacherAccunt(req, "you can't deleted by student account");
        // // isAccessProcess();
        // await Model.Package.destroy({ where: { id: req.body.id } })
        res.status(200).send({ msg: "come soon" });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

