const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// app.get('/sendConnectionRequest', userAuth, async (req, res) => {
//   const user = req.user;
//  res.send(user.firstName + ' send connection request')
// })

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
