const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const mongoose = require("mongoose");
const { validateSignUp, validateLogin } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require('./middlewares/auth')

app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLogin(req);
    console.log(email, password);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = user.validatePassword(password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = user.getJWT()
      // console.log(token);
      res.cookie("token", token);
      res.send("Login successful")
    }
  } catch (err) {
    res.status(400).send("ERROR :  " + err);
  }
});


app.get("/profile", userAuth ,async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user)
  } catch (err) {
    res.status(400).send("ERROR :  " + err);
  }
});


app.post("/signup", async (req, res) => {
  try {
    // validating the requrest
    validateSignUp(req);

    const { firstName, lastName, email, password, skills } = req.body;
    //encryption of password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      skills,
    });
    await user.save();
    res.send("User registered successfully");
  } catch (err) {
    res.status(400).send("ERROR :  " + err);
  }
});

app.get('/sendConnectionRequest', userAuth, async (req, res) => {
  const user = req.user;
 res.send(user.firstName + ' send connection request')
})

app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "photoURL",
      "description",
      "skills",
      "password",
      "age",
      "phone",
      "gender",
    ];

    const updates = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update)
    );

    if (!updates) {
      res.status(400).send("Invalid updates");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("No user found");
    }

    if (data.skills.length > 10)
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
    console.error("Error connecting to database", err)
  });
