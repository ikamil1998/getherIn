'use strict'
const Model = require('../models')
const {
    checkValidate
} = require("../utils")
const app = require('../app')
exports.sendAnswer = async (req, res, next) => {
    try {
        checkValidate(req)
        const { questionId, body, groupId } = req.body
        await Model.Answer.create({ body, questionId, groupId })
        res.send("done")
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}
exports.getLastAnswerByGroupId = async (req, res, next) => {
    try {
        checkValidate(req)
        const { id } = req.params

        const qg = await Model.QuestionGroup.findOne({ where: { groupId: id }, order: [['createdAt', 'DESC']] })
         if(qg){
        const data = await Model.Answer.findOne({ where: { groupId: id, questionId: qg.questionId }, order: [['createdAt', 'DESC']] })
        const group = await Model.Group.findOne({ where: { id }, attributes: ["leader"] })
        const leader = await Model.User.findOne({ where: { id: group.leader }, attributes: ['fullName', 'email', 'id', 'picture'] })
        const answer = data || null
        res.send({ answer, leader })
         } else{
             res.status(400).send("group has not quetion yet")
         }
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err)
    }
}