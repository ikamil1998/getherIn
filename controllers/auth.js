"use strict";

const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { sendVerificationCodeToUser, sendVerificationCodeForPasswordToUser, checkValidate } = require("../utils");
const { User, Department, ConsumerPackage } = require("../models");
const Model = require("../models");
const multer = require("multer");
const { Op } = require("sequelize");
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    return cb("Error: Images Only!");
}
const fileFilter = (req, file, cb) => {
    checkFileType(file, cb);

    // if (
    //   file.mimetype === "image/png" ||
    //   file.mimetype === "image/jpg" ||
    //   file.mimetype === "image/jpeg"
    // ) {
    //   cb(null, true);
    // } else {
    //   cb(null, false);
    // }
};
// const maxSize = 4 * 1024 * 1024;
const uploadAvatar = multer({
    storage: fileStorage,
    // fileFilter,
    // limits: { fileSize: maxSize },
}).single("avatar");
exports.sendCodeToEmail = (req, res, next) => {
    checkValidate(req);
    const email = req.body.email;
    const code = sendVerificationCodeToUser(email);
    res.status(200).json({ status: true, code });
};
exports.sendCodeToEmailToPassword = (req, res, next) => {
    checkValidate(req);
    const email = req.body.email;
    const code = sendVerificationCodeForPasswordToUser(email);
    res.status(200).json({ status: true, code });
};
exports.signup = (req, res, next) => {
    checkValidate(req);
    const email = req.body.email;
    const fullName = req.body.fullName;
    const password = req.body.password;
    const kind = req.body.kind;
    bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
            User.create({
                email,
                password: hashedPw,
                fullName,
                kind,
                name: "alaa",
            }).then(async(user) => {
                var millisecondsNow = parseInt(Date.now());
                const expiresIn = 2628000000;
                const holder = new Date(millisecondsNow + expiresIn);
                const token = jwt.sign({
                        email: user.email,
                        kind: user.kind,
                        userId: user.id,
                        name: user.fullName,
                        avatar: user.picture
                    },
                    "somesupersecretsecret", { expiresIn: expiresIn }
                );
                if (user.kind === "teacher")
                    await ConsumerPackage.create({
                        userId: user.id,
                        packageId: 1,
                        date: Date.now()
                    });
                res.status(200).json({
                    status: true,
                    token: token,
                    userId: user.id,
                    token_expires: holder,
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
exports.checkCode = (req, res, next) => {
    checkValidate(req);
    const { code, email } = req.body;
    let loadedUser;
    User.findOne({ where: { email: email } })
        .then((user) => {
            if (!user) {
                const error = new Error("A user with this email could not be found.");
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            if (user.code == code) {
                user.checkCode = true;
                user.save();
                const token = jwt.sign({
                        email: user.email,
                        kind: user.kind,
                        userId: user.id,
                        name: user.fullName,
                        avatar: user.picture
                    },
                    "somesupersecretsecret", { expiresIn: "5d" }
                );
                res.status(200).json({
                    status: true,
                    token: token,
                    userId: loadedUser.id,
                });
            } else {
                const error = new Error("Wrong Code!");
                error.statusCode = 401;
                throw error;
            }
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
exports.signin = (req, res, next) => {
    checkValidate(req);
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ where: { email } })
        .then((user) => {
            if (!user) {
                const error = new Error("A user with this email could not be found.");
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error("Wrong password!");
                error.statusCode = 401;
                throw error;
            }
            var millisecondsNow = parseInt(Date.now());
            const expiresIn = 2628000000;
            const holder = new Date(millisecondsNow + expiresIn);
            const token = jwt.sign({
                    email: loadedUser.email,
                    kind: loadedUser.kind,
                    userId: loadedUser.id,
                    name: loadedUser.fullName,
                    avatar: loadedUser.picture
                },
                "somesupersecretsecret", { expiresIn: expiresIn }
            );

            res.status(200).json({
                status: true,
                token: token,
                userId: loadedUser.id,
                kind: loadedUser.kind,
                token_expires: holder,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getUserInfoById = async(req, res, next) => {
    try {
        let number_of_department = undefined,
            number_of_group = undefined,
            startDatePackage = undefined,
            pData;
        let endDatePackage = null;
        const user = await User.findOne({
            raw: true,
            where: { id: req.tokenUserId },
            attributes: ["email", "id", "fullName", "kind", "picture", "phone"],
        });
        if (!user) {
            const error = new Error("A user with this id could not be found.");
            error.statusCode = 401;
            throw error;
        }
        if (user.kind === 'teacher') {
            const cpData = await Model.ConsumerPackage.findOne({
                raw: true,
                where: { userId: req.tokenUserId },
                attributes: [
                    "isValid",
                    "current_number_of_department",
                    "current_number_of_group",
                    "packageId",
                    "date",
                    "end_date",
                    "id",
                ],
            });
            if (cpData.isValid == 0) {
                pData = null;
                number_of_department = 0;
                number_of_group = 0;
                startDatePackage = null;
                endDatePackage = null;
            } else {
                pData = await Model.Package.findOne({
                    raw: true,
                    where: { id: cpData.packageId },
                    // attributes: ["number_of_department", "number_of_group", "id", "expiry"],
                });
                number_of_department = pData.number_of_department;
                number_of_group = pData.number_of_group;
                startDatePackage = cpData.date.toUTCString();
                endDatePackage = cpData.end_date;

            }


        }
        res.status(200).json({...user, number_of_department, number_of_group, startDatePackage, endDatePackage: endDatePackage ? endDatePackage : null, pacakgeInfo: pData });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.updatePassword1 = async(req, res, next) => {
    try {
        checkValidate(req);
        const { new_password, old_password } = req.body;
        const user = await Model.User.findByPk(req.tokenUserId);
        const comparePassword = await bcrypt
            .compare(old_password, user.password)
            .then((isEqual) => {
                if (!isEqual) {
                    const error = new Error("Wrong password!");
                    error.statusCode = 401;
                    throw error;
                }
                return isEqual;
            });
        if (comparePassword) {
            user.password = await bcrypt.hash(new_password, 12);
            user.save();
            res.send({
                ...user.dataValues,
                password: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            });
        } else {
            const err = new Error("old password is not correct");
            err.statusCode = 403;
            throw err;
        }
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.updateInfo = (req, res, next) => {
    uploadAvatar(req, res, (err) => {
        try {
            if (req.fileValidationError) {
                return res.status(400).send(req.fileValidationError);
            } else if (err instanceof multer.MulterError) {
                return res.status(400).send(err);
            } else if (err) {
                return res.status(400).send(err);
            }
            checkValidate(req);
            const { fullName, phone, email } = req.body;
            const avatar = req.file;
            let imageUrl;
            if (avatar) imageUrl = avatar.path;
            User.findOne({ where: { id: req.tokenUserId } })
                .then(async(user) => {
                    if (!user) {
                        const error = new Error(
                            "A user with this email could not be found."
                        );
                        error.statusCode = 401;
                        throw error;
                    }

                    if (fullName) user.fullName = fullName;
                    if (imageUrl) {
                        if (user.picture !== "images/defalut_icon.jpg")
                            fs.unlink(path.join(__dirname, `../${user.picture}`), (err) => {
                                console.log(err);
                            });
                        user.picture = imageUrl;
                    }
                    if (phone) {
                        const re = new RegExp(
                            "(\\+?( |-|\\.)?\\d{1,2}( |-|\\.)?)?(\\(?\\d{3}\\)?|\\d{3})( |-|\\.)?(\\d{3}( |-|\\.)?\\d{4})"
                        );
                        if (re.test(phone)) {
                            user.phone = phone;
                        } else {
                            const err = new Error("phone is Invalid");
                            err.statusCode = 400;
                            throw err;
                        }
                    }
                    if (email) {
                        const isVaildEmail = await Model.User.findOne({
                            where: {
                                email,
                                id: {
                                    [Op.ne]: req.tokenUserId
                                }
                            }
                        })
                        if (!isVaildEmail) user.email = email
                    }
                    user.save().then((newUser) => {
                        res.status(200).send({
                            ...newUser.dataValues,
                            password: undefined,
                            createdAt: undefined,
                            updatedAt: undefined,
                        });
                    });
                })
                .catch((err) => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                });
        } catch (err) {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        }
    });
};
// exports.checkEmail = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error("Validation failed.");
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   res.status(200).json({ status: true });
// };
exports.updatePassword = (req, res, next) => {
    checkValidate(req);
    const { email, newPassword } = req.body;
    User.findOne({ where: { email } })
        .then(async(user) => {
            if (!user) {
                const error = new Error("E-Mail address is not exists yet");
                error.statusCode = 401;
                throw error;
            }
            user.password = await bcrypt.hash(newPassword, 12);
            user.save().then((newUser) => {
                res.status(200).json({ msg: "successfully processed" });
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.setFirebaseToken = async(req, res, next) => {
    try {
        checkValidate(req);
        const { token } = req.body;
        await Model.User.update({ firebaseToken: token }, { where: { id: req.tokenUserId } });
        res.status(200).send({ msg: "successfully processed" });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.signOut = async(req, res, next) => {
    try {
        checkValidate(req);
        await Model.User.update({ firebaseToken: null }, { where: { id: req.tokenUserId } });
        res.status(200).send({ msg: "successfully processed" });
    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}