const validator = require('validator');

const validateSignUp = (req) =>{

    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName)
        throw new Error("First Name and Last Name are required");
    if(!email)
        throw new Error("Email is required");
    if(!password)
        throw new Error("Password is required");
}

const validateLogin = (req) =>{
    const {email} = req.body;
    if(!validator.isEmail(email))
        throw new Error("Invalid Credentials");
}

module.exports = {validateSignUp, validateLogin};