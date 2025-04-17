const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignUp, validateLogin } = require("../utils/validate");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    //validating the req
    validateSignUp(req);

    //creating the hashcode for password
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = savedUser.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.send(savedUser);
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid credentials");
    } else {
      const token = user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", "null", { expires: new Date(Date.now()) });
  res.send("Logged out successfully..");
});

module.exports = authRouter;
