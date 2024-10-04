const jwt = require("jsonwebtoken"); // For Verification
const {getJwtExpirationTime} = require('../TokenChecker/ExpireToken');

const VerifyToken = (req,res,next) =>{
    // console.log("Request Come");
    

    if(!req.headers['authorization']){
        return res.send({
            msg: "You have to give a access token" //msg / message is a key of object
        })
    }
    
    const authHeader = req.headers['authorization']
    const token = authHeader.split (' ')[1]

    getJwtExpirationTime(token);

    if(!token){
        return res.send({
            msg: "You have to give a Access Token"
        })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err){
            return res.send({
                msg: "Unauthorized"
            })
        }

        req.user = user;
        next();
    })

    // next();
}

module.exports={VerifyToken};