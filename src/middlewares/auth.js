const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) throw new Error("Token not found");
  const decodedObj = await jwt.verify(token, "TheSecret@Key");
  console.log(decodedObj);
  const id = decodedObj.id;
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  req.user = user;
  next();
};

module.exports = { userAuth };
