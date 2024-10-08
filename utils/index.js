
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const { ConsumerPackage, Package, Department, Group } = require("../models");
const Model = require("../models");
// const sendgridTransport = require("nodemailer-sendgrid-transport");
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         "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",
//     },
//   })
// );

var transporter = nodemailer.createTransport(
{
    host: 'gatherin.fun',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL || "info@gatherin.fun",
      pass: process.env.PASSWORD || 'Bv5c7-umx3s-dvijs'
    }
  }
);
function makeCode(n) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < n; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
  // return "123456";
}
exports.makeCodeCode = (n) => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < n; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
exports.sendVerificationCodeToUser = (user_email) => {
  console.log(user_email)
  const code = makeCode(6);
  const message = {
    from: process.env.EMAIL || "info@gatherin.fun", // Sender address
    to: user_email, // List of recipients
    subject: "Verification Code | GatherIn", // Subject line
    text: "verification Code " + code, // Plain text body
    html: `<div style=" min-height: 250px;
">
    <img src="https://www.gatherin.me/files/2021-08-12T20:26:06.808Z-icon.jpg" style="width: 100px;height: 100px; margin: 10px;">
    <div style="background-color: #ecf5f8;padding: 10px;width:50%;margin: 5px;border-radius: 10px;">
        <h1 style=" font-family: 'Times New Roman', Times, serif;
              color: #95a5a6 ;
              ">Welcome to Gatherin</h1>
        <h2 style=" font-family: 'Times New Roman', Times, serif;
              color: #5f5d5f;width: 75%;
              ">
            To create new Account, enter this verification code in the app Gatherin
            <span style="color: #c840ce;
                          font-size: 20px;
                          text-decoration: underline;
                          font-weight: bolder;
                          ">
                ${code}</span>
        </h2>
    </div>
</div>`,
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      // console.log(info);
    }
  });
  return code;
};
exports.sendVerificationCodeForPasswordToUser = (user_email) => {
  const code = makeCode(6);
  const message = {
    from: process.env.EMAIL || "info@gatherin.fun", // Sender address
    to: user_email, // List of recipients
    subject: "Verification Code | GatherIn", // Subject line
    text: "verification Code " + code, // Plain text body
    html: `<div style=" min-height: 250px;
">
    <img src="https://www.gatherin.me/files/2021-08-12T20:26:06.808Z-icon.jpg" style="width: 100px;height: 100px; margin: 10px;">
    <div style="background-color: #ecf5f8;padding: 10px;width:50%;margin: 5px;border-radius: 10px;">
        <h1 style=" font-family: 'Times New Roman', Times, serif;
              color: #95a5a6 ;
              ">Welcome to Gatherin</h1>
        <h2 style=" font-family: 'Times New Roman', Times, serif;
              color: #5f5d5f;width: 75%;
              ">
            To change your password, enter this verification code in the app Gatherin
            <span style="color: #c840ce;
                          font-size: 20px;
                          text-decoration: underline;
                          font-weight: bolder;
                          ">
                ${code}</span>
        </h2>
    </div>
</div>`,
  };
  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      // console.log(info);
    }
  });
  return code;
};

exports.checkValidate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 409;
    error.data = errors.array();
    // if (error.data[0].msg === "E-Mail address already exists!");
    // error.statusCode = 400;
    throw error;
  }
};
exports.isAccessProcess = async (model, id) => {
  let gData,
    dData,
    cpData,
    isValid = false;
  switch (model) {
    case "group":
      gData = await Group.findOne({
        raw: true,
        where: { id: id },
        attributes: ["departmentId", "id"],
      });
      dData = await Department.findOne({
        raw: true,
        where: { id: gData.departmentId },
        attributes: ["userId", "id"],
      });
      cpData = await ConsumerPackage.findOne({
        raw: true,
        where: { userId: dData.userId },
        attributes: [
          "isValid",
          "current_number_of_department",
          "current_number_of_group",
          "packageId",
          "id",
        ],
      });
      isValid = cpData.isValid;
      break;
    case "department":
      dData = await Department.findOne({
        raw: true,
        where: { id },
        attributes: ["userId", "id"],
      });
      cpData = await ConsumerPackage.findOne({
        raw: true,
        where: { userId: dData.userId },
        attributes: ["isValid", "id"],
      });
      isValid = cpData.isValid;
      break;

    case "create":
      cpData = await Model.ConsumerPackage.findOne({
        raw: true,
        where: { userId: id },
        attributes: ["isValid"],
      });
      isValid = cpData.isValid;
      break;
    default:
      break;
  }
  return isValid;
};
exports.checkTeacherAccunt = (req, message) => {
  if (req.tokenUserKind !== "teacher") {
    const err = new Error(message);
    err.statusCode = 403;
    throw err;
  }
};
exports.checkAdminAccunt = (req, message) => {
  if (req.tokenUserKind !== "admin") {
    const err = new Error(message);
    err.statusCode = 403;
    throw err;
  }
};
exports.changeValidForConsumerPackage = async () => {
  const cp = await ConsumerPackage.findAll();
  cp.every(async (item) => {
    const data = await Package.findOne({
      where: { id: item.packageId },
      attributes: ["expiry"],
    });
    // ! test
    const { date } = item.dataValues;
    const { expiry } = data.dataValues;
    date.setDate(date.getDate() + expiry);
    date.setHours(0, 0, 0, 0);
    let today = new Date().toLocaleDateString();
    if (date.toLocaleDateString() === today) {
      item.update({ isValid: false });
    }
  });
};
