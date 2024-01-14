const {body} =require("express-validator")

exports.send=[
    body('body').not().isEmpty().withMessage("body is empty"),
    body('questionId').not().isEmpty().withMessage("question_ID is empty"),
    body('groupId').not().isEmpty().withMessage("group_ID is empty")
]
// exports.get=[
//     body('groupId').not().isEmpty().withMessage("group_ID is empty")
// ]