import express from 'express';
import  { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
let config = JSON.parse(fs.readFileSync("/Users/pritammondal/Documents/interview/config.json", "utf-8"));
const jwtKey = config.jwt;
const router=express.Router();

/**
 * This is login route
 */
router.post('/login',async(req, res)=>{
    try{
        let  email =  req.body?.email;
        email = email?.toLowerCase();
        const user=await User.findOne({where:{email: email}});
        if(!user){
            return res.status(404).json("User not found");
        }
        const validPassword=await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(400).json("Wrong password");
        }
        const accessToken=jwt.sign({
            id:user.id,
            name:user.name
        }, jwtKey.accessTokenSecret, {expiresIn: jwtKey.expTime});
        res.status(200).json({ accessToken: accessToken});
    }catch(err){
        res.status(500).json(err);
    }
});

/**
 * This is register route
 */
router.post('/register',async(req,res)=>{
    try{
        let  email =  req.body?.email;
        email = email?.toLowerCase();
        const userData=await User.findOne({where:{email: email}});
        if(userData){
            return res.status(404).json("User already exist");
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        const newUser=new User({
            email: email,
            password:hashedPassword,
            status: 'active'
        });
        const user=await newUser.save();
        res.status(200).json({messase: "User Created Successfully"});
    }catch(err){
        res.status(500).json(err);
    }
});

export default router;