const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateUpdateData } = require("../utils/validate");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found ");
    } else res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    validateUpdateData(req);
    if (!validateUpdateData) {
      throw new Error("Invalid update request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((update) => {
      loggedInUser[update] = req.body[update];
    });

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} , your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isPasswordCorrect = await user.validatePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new Error("Old password is incorrect");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    res.send(user.firstName + " , your password updated successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

module.exports = profileRouter;
