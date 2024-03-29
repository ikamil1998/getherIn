const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  console.log(token);
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.token = token;
  req.tokenEmail = decodedToken.email;
  req.tokenUserKind = decodedToken.kind;
  req.tokenUserId = decodedToken.userId;
  req.tokenName=decodedToken.name
  req.tokenAvatar=decodedToken.avatar
  next();
};
