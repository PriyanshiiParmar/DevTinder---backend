const express = require("express");
const userRouter = express.Router();
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const Users = require("../models/user");
const SAFE_DATA = "firstName lastName age photoURL skills description";

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      reciever: loggedInUser._id,
      status: "interested",
    }).populate("sender", SAFE_DATA);
    -res.json({ message: "Data fetched successfully", data: requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(400).json({ error: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { sender: loggedInUser._id, status: "accepted" },
        { reciever: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("sender", SAFE_DATA)
      .populate("reciever", SAFE_DATA);

    const data = connections.map((connection) => {
      if (connection.sender._id.toString() === loggedInUser._id.toString()) {
        return connection.reciever;
      }
      return connection.sender;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
 try{
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;


    // feed must not contain
    // 1. the loggedIn user
    // 2. the connections
    // 3. whom the user already ignored or marked interested
    const connections = await ConnectionRequest.find({
      $or: [{ reciever: loggedInUser._id }, { sender: loggedInUser._id }],
    }).select("reciever sender");
  
    const hiddenFromFeed = new Set();

    connections.map((request) => {
      hiddenFromFeed.add(request.reciever);
      hiddenFromFeed.add(request.sender);
    });
  
    // res.send("Har Har Mahadev");
  
    const data = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hiddenFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ],
    }).select(SAFE_DATA).skip(skip).limit(limit);
  
    res.json({data});
 }
 catch(err){
    res.status(400).send("ERROR : " + err);
 }

});

module.exports = userRouter;
