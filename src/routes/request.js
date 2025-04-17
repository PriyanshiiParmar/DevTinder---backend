const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      // console.log(user);
      const { status, toUserId } = req.params;
      if (!user) {
        throw new Error("User not found");
      }
      const fromUserId = user._id;
      const request = new ConnectionRequest({
        sender: fromUserId,
        reciever: toUserId,
        status,
      });

      const isConnectionExist = await ConnectionRequest.findOne({
        $or: [
          { sender: fromUserId, reciever: toUserId },
          { sender: toUserId, reciever: fromUserId },
        ],
      });

      if (isConnectionExist) {
        throw new Error("Connection already exist");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("User does not exist");
      }

      if (!["ignored", "interested"].includes(status)) {
        throw new Error(`Invalid status type : ${status}`);
      }

      const data = await request.save();

      const emailRes = await sendEmail.run("Hey!! You got a new friend request from ", `${user.firstName} sent a connection request to  ${toUser.firstName} `);
      console.log(emailRes);

      await request.save();
      res.json({
        message: `${user.firstName} sent connection request to ${toUser.firstName}`,
        data: request,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        throw new Error("User not found");
      }
      const { status, requestId } = req.params;

      // console.log(status, requestId);

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type : ", status);
      }

      const request = await ConnectionRequest.findOne({
        // _id: requestId,
        status: "interested",
        reciever: loggedInUser._id,
      });

      if (!request) {
        throw new Error("Connection request not found");
      }

      request.status = status;

      res.json({
        message: `Connection request ${status} successfully`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  }
);

module.exports = requestRouter;
