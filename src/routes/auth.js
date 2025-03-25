const express = require('express');
const authRouter = express.Router();
const User = require('../models/user')
const {validateSignUp, validateLogin} = require('../utils/validate')
const bcrypt = require('bcrypt')

authRouter.post('/signup', async (req, res) =>{
    try{
        //validating the req
        validateSignUp(req);

        //creating the hashcode for password
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName, lastName, email, password: passwordHash
        });
        await user.save();
        res.send(firstName + " registered successfully..")
    }
    catch(err){
        res.status(400).send("ERROR : " + err);
    }
})


authRouter.post('/login', async (req, res)=>{
    try{
        validateLogin(req);
        const {email, password} = req.body;
        const user = await User.findOne({email : email});
        if(!user)
        {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = user.validatePassword(password);
        if(!isPasswordValid)
        {
            throw new Error("Invalid credentials");
        }
        else{
            const token = user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 3600000)});
            res.send(user.firstName+" logged in successfully..")
        }   
    }
    catch(err){
        res.status(400).send("ERROR : " + err);
    }
})


authRouter.post('/logout', async (req, res) =>{
    res.cookie('token', "null", {expires: new Date(Date.now())});
    res.send("Logged out successfully..");
})

module.exports = authRouter;