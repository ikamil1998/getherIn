const { labels } = require("../intl");
const Model = require("../models");
const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");
const { body } = require("express-validator");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files");
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
    // checkFileType(file, cb);
};
// const maxSize = 4 * 1024 * 1024;
const uploadAvatar = multer({
    storage: fileStorage,
    // fileFilter,
    // limits: { fileSize: maxSize },
}).single("file");
exports.root = (req, res, next) => {
    // const lang = req.query.lang || "en";
    const { code } = req.params

    const userAgent = req.headers['user-agent'];
    // console.log(userAgent.indexOf(''))
    if (userAgent.indexOf("Android") != -1)
    // res.redirect("intent://8xn9iq3lG_w/#Intent;scheme=vnd.youtube;package=com.google.android.youtube;S.browser_fallback_url=market://details?id=com.google.android.youtube;end;")
        res.send("iOS");
    if (userAgent.indexOf("like Mac") != -1)
        res.send("iOS");
    if (userAgent.indexOf("Win") != -1)
        res.send("Windows OS");
    if (userAgent.indexOf("Mac") != -1)
        res.send("Macintosh");
    if (userAgent.indexOf("Linux") != -1) Name =
        res.send("Linux OS");
    res.send('other OS')
};
exports.about = async(req, res, next) => {
    // const lang = req.query.lang || "en";
    const data = await Model.About.findOne({ raw: true });
    res.send({ body_ar: data.body_ar.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, ""), body_en: data.body_en.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, "") });
};
exports.aboutView = async(req, res, next) => {
    const lang = req.query.lang || "en";
    const data = await Model.About.findOne({ raw: true });
    if (lang === "ar")
        res.send(data.body_ar.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, ""));
    else
        res.send(data.body_en.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, ""));
}
exports.privacy = async(req, res, next) => {
    // const lang = req.query.lang || "en";
    const data = await Model.Privacy.findOne({ raw: true });
    res.send({ body_ar: data.body_ar.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, ""), body_en: data.body_en.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, "") });
};
exports.privacyView = async(req, res, next) => {
    const lang = req.query.lang || "en";
    const data = await Model.Privacy.findOne({ raw: true });
    if (lang === "en")
        res.send(data.body_en.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, ""));
    else
        res.send(data.body_ar.replace(/\n/g, '').replace(/"/g, "'").replace(/\r/g, ""));

};
exports.uploadFile = async(req, res, next) => {
    uploadAvatar(req, res, (err) => {
        try {
            const { path } = req.file
            res.send({ path })
        } catch (err) {
            next(err)
        }
    })
}


exports.deleteChatByRoomId = async(req, res, next) => {
    try {
        const { id } = req.params
        await Model.Chat.destroy({ where: { room: id } })
        res.send("done")
    } catch (err) {
        next(err)
    }
}


exports.userList = async(req, res, next) => {
    try {
        let data = [],
            uniqueData = [];
        const departments = await Model.UserDepartment.findAll({
            raw: true,
            where: { userId: req.tokenUserId },
            attributes: ["departmentId"],
        });
        if (req.tokenUserKind === 'student') {
            for (const item of departments) {
                const handle = await Model.Department.findOne({
                    raw: true,
                    where: { id: item.departmentId },
                    attributes: ["userId"],
                    // include:{
                    //   model:Model.User,
                    // }
                });
                // console.log(handle);
                data.push(handle.userId);
            }

            uniqueData = data.filter((item, i, ar) => ar.indexOf(item) === i);
            data = []
            for (const i of uniqueData) {
                const User = await Model.User.findOne({
                    raw: true,
                    where: { id: i },
                    attributes: ['id', 'email', 'fullName', 'picture']
                })
                const countOfUnReadChat = await Model.ChatPM.count({ where: { senderId: User.id, reciverId: req.tokenUserId, isRead: false } })
                data.push({...User, countOfUnReadChat })
            }
            res.send(data)
        } else if (req.tokenUserKind === 'teacher') {
            for (const item of departments) {
                const users = await Model.UserDepartment.findAll({
                    raw: true,
                    where: {
                        departmentId: item.departmentId,
                        userId: {
                            [Op.ne]: req.tokenUserId
                        }
                    },
                    attributes: ["userId"],
                });
                for (const i of users)
                    data.push(i.userId)
            }
            uniqueData = data.filter((item, i, ar) => ar.indexOf(item) === i);
            data = []
            for (const i of uniqueData) {

                const User = await Model.User.findOne({
                    raw: true,
                    where: { id: i },
                    attributes: ['id', 'email', 'fullName', 'picture']
                })
                const countOfUnReadChat = await Model.ChatPM.count({ where: { senderId: User.id, reciverId: req.tokenUserId, isRead: false } })
                data.push({...User, countOfUnReadChat })
            }
            res.send(data)
        } else {
            res.status(400).send("you can't use")
        }
    } catch (err) {
        next(err)
    }
}
exports.isValid = async(req, res, next) => {
    try {
        const data = await Model.ConsumerPackage.findOne({
            where: {
                userId: req.tokenUserId
            },
            attributes: ['isValid', "date", "end_date"],
            include: {
                model: Model.Package,
                attributes: [
                    "name",
                    "price",
                    "number_of_department",
                    "number_of_group",
                    "number_of_students",
                    "expiry",
                    "image",
                    "type"
                ]
            }
        })
        console.log(typeof data.date)

        let endDatePackage = data.end_date;

        res.send({ isValid: data.isValid, startDate: data.date.toUTCString(), endDate: endDatePackage ? endDatePackage : null, packageInfo: {...data.Package.dataValues, expiry: undefined } })

    } catch (err) {
        next(err)
    }
}
exports.valid = async(req, res, next) => {
    try {
        const result = await Model.ConsumerPackage.update({ isValid: req.body.valid > 0 }, { where: { userId: req.tokenUserId } });
        res.status(result ? 200 : 400).send(result ? { msg: "done" } : { msg: "error" })
    } catch (err) {
        next(err)
    }
}
exports.changeStatusOfPMChat = async(req, res, next) => {
    try {
        const { other_id } = req.body
        const result = await Model.ChatPM.update({ isRead: true }, { where: { senderId: other_id, reciverId: req.tokenUserId, isRead: false } });
        res.status(result ? 200 : 400).send(result ? { msg: "done" } : { msg: "error" })
    } catch (err) {
        next(err)
    }
}