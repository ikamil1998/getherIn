
'use strict'
const Model = require('../models')
const {
    checkValidate
} = require("../utils")
const app = require('../app')
const { admin } = require('../utils/firebase-config')
exports.sendQuestion = async (req, res, next) => {
    try {
        checkValidate(req)
        const { groups, type, body, options } = req.body
        let tokens = []
        if (type === 'single') {
            const question = await Model.Question.create({ type, body })
            for (const i of groups) {
                const messsage = {
                    room: i,
                    senderId: req.tokenUserId,
                    senderName: req.tokenName,
                    senderImage: req.tokenAvatar,
                    type: "question",
                    msg: "",
                    img: "",
                    question: {
                        type,
                        body
                    }
                }
                const group = await Model.Group.findByPk(i)
                const users = await Model.UserGroup.findAll({
                    raw: true,
                    where: { groupId: i },
                    include: {
                        model: Model.User,
                        attributes: ["firebaseToken", "id"]
                    }
                })
                for (const user of users) {
                    await Model.Notification.create({
                        title_ar: "سؤال جديد",
                        title_en: "new question",
                        body_ar: `${group.name} سؤال جديد في المجوعة`,
                        body_en: `new question in ${group.name}`,
                        userId: user.userId,
                    })
                }
                let data = users.map((item) => item["User.firebaseToken"]);
                let uniqueData = data.filter((item, i, ar) => ar.indexOf(item) === i);
                tokens = { ...tokens, ...uniqueData }
                await Model.QuestionGroup.create({ groupId: i, questionId: question.id })
                await Model.Chat.create({ ...messsage, question: question.id })
                app.io.to(i).emit("question", messsage)
                app.io.to(parseInt(i)).emit('receiveMessage', messsage)
            }
            for (const registrationToken of Object.values(tokens)) {
                if (registrationToken) {
                    const message = {
                        data: {
                            body: "new Qusetion",
icon: "https://www.gatherin.me/files/2021-09-07T07:41:06.045Z-photo_2021-07-18_16-43-46.jpg",
                            title: "new notification"
                        },
                        token: registrationToken
                    }
                    // await Model.Notification.create({body_en:body,titlel_en:"notifiction",userId:})
                    admin.messaging().send(message)
                }
            }
            res.send("done")
        }
        else {
            if (!options) {
                const err = new Error("options is not defined")
                throw err
            }
            const question = await Model.Question.create({ type, body })
            for (const item of options) {
                const opiton = await Model.Option.create({
                    body: item,
                    questionId: question.id
                })
                for (const group of groups) {
                    const Users = await Model.UserGroup.findAll({ raw: true, where: { groupId: group } })
                    for (const i of Users)
                        await Model.OptionGroup.create({
                            userId: i.userId,
                            selected: false,
                            optionId: opiton.id,
                            groupId: group

                        })
                }
            }
            for (const i of groups) {
                const data = options.map(item => {
                    return {
                        body: item,
                        selected: false,
                        counter: 0
                    }
                })
                const messsage = {
                    room: i,
                    senderId: req.tokenUserId,
                    senderName: req.tokenName,
                    senderImage: req.tokenAvatar,
                    type: "question",
                    msg: "",
                    img: "",
                    Question: {
                        type,
                        body,
                        options: data
                    }
                }
                const group = await Model.Group.findByPk(i)
                const users = await Model.UserGroup.findAll({
                    raw: true,
                    wher: { groupId: i },
                    include: {
                        model: Model.User,
                        attributes: ["firebaseToken", "id"]
                    }
                })
                for (const user of users) {
                    await Model.Notification.create({
                        title_ar: "سؤال جديد",
                        title_en: "new question",
                        body_ar: `${group.name} سؤال جديد في المجوعة`,
                        body_en: `new question in ${group.name}`,
                        userId: user.id,
                    })
                }
                let data1 = users.map((item) => item["User.firebaseToken"]);
                let uniqueData = data1.filter((item, i, ar) => ar.indexOf(item) === i);
                tokens = { ...tokens, ...uniqueData }

                app.io.to(i).emit("receiveMessage", messsage)
                app.io.to(i).emit("question", messsage)
                await Model.QuestionGroup.create({ groupId: i, questionId: question.id })
                await Model.Chat.create({ ...messsage, question: question.id })

            }
            for (const registrationToken of Object.values(tokens)) {
                if (registrationToken) {
                    const message = {
                        notification: {
                            body: "new Qusetion",
			icon: "https://www.gatherin.me/files/2021-09-07T07:41:06.045Z-photo_2021-07-18_16-43-46.jpg",
                            title: "new notification"
                        },
                        token: registrationToken
                    }
                    // await Model.Notification.create({body_en:body,titlel_en:"notifiction",userId:})
                    admin.messaging().send(message)
                }
            }
            res.send("done 2")
        }
    } catch (err) {
        if (err.message === "options is not defined")
            err.statusCode = 409
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getLastQuestionByGroupId = async (req, res, next) => {
    try {
        const data = await Model.QuestionGroup.findOne({
            where: { groupId: req.params.id }, order: [['createdAt', 'DESC']], include: {
                model: Model.Question,
                attributes: ["body", 'type', "id"],
                require: false,
                include: {
                    model: Model.Option,
                    attributes: ["body", "id"],
                    include: { model: Model.OptionGroup, attributes: ["optionId", "userId", "selected", "groupId", "id"] }
                }
            }
        })
        if (data) {
            const { id, body, type, Options } = data.Question.dataValues
            const isAnswer = await Model.Answer.findOne({ where: { groupId: req.params.id, questionId: id } })
            const options = []
            for (const item of Options) {
                const { body, OptionGroups } = item.dataValues
                let counter = 0, handelSelected = false, id = null;
                for (const OptionGroup of OptionGroups) {
                    id = OptionGroup.dataValues.optionId
                    const { selected, userId } = OptionGroup.dataValues
                    if (selected) counter++;
                    if (userId === req.tokenUserId && selected)
                        handelSelected = true;
                }
                options.push({ body, counter, selected: handelSelected, id })
            }
            // console.log(Options)
            if (options.length)
                res.json({ id, type, body, options, isAnswer: !!isAnswer })
            else
                res.json({ id, type, body, isAnswer: !!isAnswer })
        } else {
            res.status(400).send("bad request")
        }

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}
