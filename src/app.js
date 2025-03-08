const express = require("express");

const app = express();

const { connectDB } = require("./config/database");

const User = require("./models/user");

const mongoose = require("mongoose");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user
    .save()
    .then(() => {
      res.send("User registered successfully");
    })
    .catch((err) => {
      res.status(400).send("error registering user"+err);
    });
});

app.get("/feed", async (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  try {
    const user = await User.findOne({email: email});
    // const user = await User.findById(id);
    if (!user) res.send("No user found with this email");
    else res.send(user);
  } catch {
    res.status(400).send("Something went wrong");
  }
});


app.get("/deleteUser", async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) res.send("no user found");
    else res.send("User deleted successfully");
  } catch {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/updateUser/:userId", async (req, res) => {
  const  userId = req.params.userId;
  console.log(userId);
  const data = req.body;
  try {

    const ALLOWED_UPDATES = ["photoURL", "description", "skills", "password", "age","phone","gender"]

    const updates = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));

    if(!updates)
    {
      res.status(400).send("Invalid updates");
    }

    const user = await User.findByIdAndUpdate(userId, data, {runValidators:true});
    if (!user) {
      return res.status(404).send("No user found");
    }

    if(data.skills.length > 10)
      throw new Error("Skills should be less than 10");

    return res.send("User updated successfully");
  } catch (error) {
    return res.status(400).send("Something went wrong");
  }
});


connectDB()
  .then(() => {
    console.log("Database connection establised...");
    app.listen(7777, () => {
      console.log("Server is successfully running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
  });
