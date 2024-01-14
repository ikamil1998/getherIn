const express = require("express");
// help
const isAuth = require("../middleware/is-auth");
// const uuidv4 = require("uuid/v4")
const rootController = require("../controllers/root");

const router = express.Router();

//router.get("/:code", rootController.root);
router.get("/user/list", isAuth, rootController.userList);
router.get("/about", rootController.about);
router.get("/about/view", rootController.aboutView);
router.get("/privacy", rootController.privacy);
router.get("/privacy/view", rootController.privacyView);
router.post('/uploadFile', rootController.uploadFile)

router.get('/isvalid',isAuth, rootController.isValid)

router.post('/valid', isAuth, rootController.valid)
router.post('/delete/chat/room/:id', rootController.deleteChatByRoomId)
router.post('/private/chat/changeStatus', isAuth, rootController.changeStatusOfPMChat)

// help
// let data = []
// router.get("/show", isAuth, (req, res, next) => {
//     try {
//         res.send(data)
//     } catch (err) {
//         next(err)
//     }
// })
// router.post("/add", isAuth, (req, res, next) => {
//     try {
//         const { user, type, age } = req.body
//         const id = Date.now()
//         data.push({ user, type, age, id })
//         res.send("done")
//     } catch (err) {
//         next(err)
//     }
// })

// router.post("/delete/item", isAuth, async(req, res, next) => {
//     try {
//         const { id } = req.body
//         // data.forEach(item=>{
//         //     console.log(item.id)
//         //     console.log(item.id != id)
//         // })
//         data=await data.filter(item=>item.id!=id)
//         // data=[]
//         console.log(data)
//         res.send("done")
//     } catch (err) {
//         next(err)
//     }
// })
// router.post("/update", isAuth, (req, res, next) => {
//     try {
//         const { id,user,type,age } = req.body
//         data=data.map(item=>{
//             if(item.id==id)
//             {
//                 if(user)item.user=user
//                 if(type)item.type=type
//                 if(age)item.age=age
//                 return item
//             }
//             else return item
//         })
//         res.send("done")
//     } catch (err) {
//         next(err)
//     }
// })

module.exports = router;
