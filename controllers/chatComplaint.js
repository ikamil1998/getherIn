"use strict";

const Models = require("../models");
const {
    checkValidate,
} = require("../utils");
const ITEMS_PER_PAGE = 10;

exports.create = async (req, res, next) => {
    try {
        checkValidate(req);
        const { message, groupId, userId } =
            req.body;
        await Models.ChatComplaint.create({
            createUserId: req.tokenUserId,
            message, groupId, userId
        });
        res.send({ msg: "successfully processed" });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.getById = async (req, res, next) => {
    try {
        checkValidate(req);
        const { id } = req.params;
        const data = await Models.ChatComplaint.findOne({ where: { id } })
        !!data ? res.send(data) : res.status(400).send({ msg: "id is not exist" })
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.getAll = async (req, res, next) => {
    try {
        checkValidate(req);
        const data = await Models.ChatComplaint.findAll()
        res.status(200).send(data);
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.update = async (req, res, next) => {
    try {
        checkValidate(req);
        const { message, groupId, userId,id } = req.body;
        await Models.ChatComplaint.update({ message, groupId, userId }, { where: { id } })
        res.send({ msg: 'successfully' });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.delete = async (req, res, next) => {
    try {
        await Models.ChatComplaint.destroy({ where: { id: req.body.id } })
        res.status(200).send({ msg: "Successful" });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

