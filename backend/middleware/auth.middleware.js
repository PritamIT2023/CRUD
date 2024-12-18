import jwt from 'jsonwebtoken';
import fs from 'fs';
let config = JSON.parse(fs.readFileSync("/Users/pritammondal/Documents/interview/config.json", "utf-8"));
const jwtKey = config.jwt;

export const authenticate = (req, res, next)=>{
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtKey.accessTokenSecret, (err, user)=>{
      if(err){
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    })
  }else{
    res.status(401).json("You are not authenticated");
  }
}