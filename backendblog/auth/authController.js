// Logics will be written here

const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const User = require('../models/User');
const {cloudinary}= require('../config/cloudinaryConfig');

// Multer Setup
const multer = require('multer');

const {storage} = require('../config/cloudinaryConfig'); 

const upload = multer({storage:storage}); // ({storage}); because object and key keep similar name

const jwt = require('jsonwebtoken');

const { use } = require('./authRoutes');


//****** Register User***** */

const register = async (req,res) =>{
    // const errors = validationResult(req);

    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         errors:errors.array()
    //     })
    // }

    const {email, password, firstName, lastName} = req.body;
    
    try{
        let user = await User.findOne({email});

        if(user){
            res.send({
                msg:"User Already Exits"
            })
        }

        const uploadImage = await cloudinary.uploader.upload(req.file.path,{
            folder: "user_images"
        });

        user = new User({
            email,
            password: await bcrypt.hash(password,10),
            firstName,
            lastName,
            profileImage:uploadImage.secure_url,
        });

        await user.save();
        res.send({
            msg: "User Registered Successfully",
            user
        })

    } catch(error){
        res.status(500).json({
            msg:"Server Error"
        })
    }
}



//************ Login A User******* */

const login = async(req,res) =>{
    const {email, password} = req.body;
    try {

        const user = await User.findOne({email});

        if(!user){
            res.send({
                msg:"Not Found"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if(passwordMatch){
            const accessToken = jwt.sign({id:user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"1d"});
            
            const refreshToken = jwt.sign({id:user._id}, process.env.REFRESH_TOKEN_SECRET);
        

        user.refreshToken = refreshToken;
        await user.save();

            res.send({
                msg:"Login Successful", user, accessToken
            })      

        }
        else{
            res.send({
                msg:"Invalid Credentials"
            })
        }
        


    } catch(error) {
        res.send({
            msg:error.message
        })
    }
}



// ************* Refresh Token***********

const refreshToken = async(req,res)=>{

    const {refreshToken} = req.body;

    if(!refreshToken){
        res.send({
            msg: "Access Denied"
        })
    }

    try{

        const user = await User.findOne({refreshToken});

        if(!user){
            res.send({
                msg: "Access Denied"
            })
        }

        // Another Layer of Security
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=>{
            if(err){
                return res.send({
                    msg:"Access Denied"
                })
            }

            const newAccessToken = jwt.sign({id:user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'});

            res.send({
                accessToken: newAccessToken
            })
        })

    } catch(error) {
        res.send({
            msg:error.message
        })
    }

    
    // res.send({
    //     refreshToken
    // })
}


// ********** Get Profile By ID**********

const getProfile = async(req,res)=>{
    try{

        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            res.send({
                msg: "User Not Found"
            })
        }


        res.send({
            msg: "Profile Found",
            user
        })

    } catch(error) {
        res.send({
            msg: error
        })
    }
}


// ******* Update Profile *********
// Put or Patch request

const updateProfile = async(req,res)=>{

    try{

        const userId = req.params.id;
        
        // console.log(userId);
        // console.log(req.user.id);

        if(req.user.id != userId){
            return res.send({
                msg: "You can only update your profile"
            })
        }

        let user = await User.findById(userId);
        // console.log(user);

        const {firstName,lastName} = req.body;
        if(firstName){
            user.firstName = firstName
            // user.firstName comes from DB, and 'firstName' is from req.body, from the User Schema.  
        }
        
        if(lastName){
            user.lastName = lastName
        }

        if(req.file){
            const uploadImage = await cloudinary.uploader.upload(req.file.path,{
                folder:"user_new_images"
            })

            user.profileImage = uploadImage.secure_url
            
        }

        await user.save();

        res.send ({
            msg: "Success",
            user
        })

    } catch(error) {
        res.send({
            msg: error
        })
    }
}


module.exports = {register, upload, login, refreshToken, getProfile, updateProfile};