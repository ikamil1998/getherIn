"use strict";

const { Package } = require("../models");
const Model = require("../models");
const {
  checkValidate,
  checkTeacherAccunt,
  checkAdminAccunt,
  isAccessProcess,
} = require("../utils");
exports.create = async (req, res, next) => {
  try {
    checkValidate(req);
    checkAdminAccunt(req, "available for admin only");
    // const { name, price, expiry, number_of_department, number_of_group, number_of_students } =
    const { name, price, expiry, number_of_department, type, image } =
      req.body;
    const data = await Model.Package.findOne({ where: { name } });
    // console.log(expiry);
    if (!data) {
      // await Model.Package.create({
      //   name,
      //   price,
      //   expiry,
      //   number_of_department,
      //   number_of_group,
      //   number_of_students
      // });
      await Model.Package.create({
        name,
        name_ar,
        price,
        expiry,
        number_of_department,
        image,
        type,
        type_ar
      });
    } else {
      res.status(400).send("name of package is exist");
    }
    // isAccessProcess();
    res.json({ msg: "successfully processed" });
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
    if (id) return res.status(400).send({ msg: "id is not defined" })
    const data = await Package.findOne({ raw: true, where: { id } });
    // console.log(data);
    res.send(data);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    checkValidate(req);
    // isAccessProcess();
    const currentCP = await Model.ConsumerPackage.findOne({
      raw: true,
      where: { userId: req.tokenUserId },
      attributes: [
        "current_number_of_department",
        "id",
      ],
    });
    const _packages = await Model.Package.findAll({
      raw: true,
      where: { private: 0 },
      attributes: [
        "name",
        "name_ar",
        "price",
        "number_of_department",
        "number_of_group",
        "number_of_students",
        "expiry",
        "image",
        "type",
        "type_ar",
        "pack_ios_ID",
        "pack_android_ID",
        "id",
      ],
    });
    const packages = _packages.map(x => {
      return { ...x, CanBuy: currentCP.current_number_of_department <= x.number_of_department }
    })
    console.log(packages)
    res.status(200).send(packages);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
exports.update = async (req, res, next) => {
  checkValidate(req);
  //   isAccessProcess();
  const { id, name, name_ar, price, expiry, number_of_department, number_of_group, type, type_ar, image } =
    req.body;
  await Model.Package.update({ image, name, name_ar, price, expiry, number_of_department, type, type_ar, number_of_group, number_of_students: 8 * number_of_group }, { where: { id } })
  res.send("done");
};
exports.delete = async (req, res, next) => {
  try {
    checkValidate(req);
    // checkTeacherAccunt(req, "you can't deleted by student account");
    // isAccessProcess();
    await Model.Package.destroy({ where: { id: req.body.id } })
    res.status(200).send("done");
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.BuyPackage = async (req, res, next) => {
  try {
    checkValidate(req);
    checkTeacherAccunt(req, "you can't create by student account");
    const currentCP = await Model.ConsumerPackage.findOne({
      raw: true,
      where: { userId: req.tokenUserId },
      attributes: [
        "current_number_of_department",
        "id",
      ],
    });
    // const currentCP = await Model.ConsumerPackage.findOne({
    //   raw: true,
    //   where: { userId: req.tokenUserId },
    //   attributes: [
    //     "current_number_of_department",
    //     "current_number_of_group",
    //     "id",
    //   ],
    // });
    if (
      req.packageName === "free" ||
      // currentCP.current_number_of_group > req.number_of_group ||
      currentCP.current_number_of_department > req.number_of_department
    ) {
      const err = new Error("you can't buy that pacakage");
      err.statusCode = 403;
      throw err;
    } else {
      const cp = await Model.ConsumerPackage.findOne({
        where: { userId: req.tokenUserId },
      });
      cp.packageId = req.body.packageId;
      cp.isValid = 1;
      cp.date = Date.now();
      cp.save();
      res.send({ msg: "successfully processed" });
    }
    // await Model.
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
