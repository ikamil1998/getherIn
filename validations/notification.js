const {body}=require("express-validator")

exports.send=[
    body("groups").isArray().withMessage("groups should be array"),
    body("body").not().isEmpty().withMessage("type must not empty")
]


