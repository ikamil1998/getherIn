const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gather-in-c1235-default-rtdb.firebaseio.com",
});

exports.admin = admin;
