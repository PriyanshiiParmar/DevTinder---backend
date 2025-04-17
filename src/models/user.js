const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 25,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 25,
    },
    email: {
      type: String,
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: (value) => {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate: (value) => {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    phone: {
      type: Number,
      validate: (value) => {
        if (!validator.isMobilePhone(value.toString(), "en-IN")) {
          throw new Error("Invalid Phone Number");
        }
      },
      min: 10,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    photoURL: {
      type: String,
      default: "https://www.svgrepo.com/show/452030/avatar-default.svg",
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, "TheSecret@Key", {
    expiresIn: "7d",
  });
  if (!token) {
    throw new Error("Token is invalid");
  } else return token;
};

userSchema.methods.validatePassword = async function (userPassword) {
  const hashPassword = this.password;
  console.log(userPassword);
  const isValidPassword = await bcrypt.compare(userPassword, hashPassword);
  console.log(isValidPassword);
  return isValidPassword;
};

module.exports = mongoose.model("user", userSchema);
