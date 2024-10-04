const express = require('express');
const{check} = require('express-validator');
const {register,upload, login, refreshToken, getProfile, updateProfile} = require('../auth/authController');
const router = express.Router();
const {VerifyToken} = require('./authMiddleware')


router.post('/register', upload.single('profileImage'), register);

router.post('/login', login);



// Refresh Token
router.post('/refresh-token', refreshToken);

// Get User By Id
router.get('/profile/:id', VerifyToken, getProfile);


// Update profile
router.patch('/profile/update/:id', VerifyToken, updateProfile);



module.exports = router;






// [
//     check('email', "Valid Image is Required").isEmail(),
//     check('password', "Minimum Length 8"). isLength({min:6}),
//     check("firstName", "First Name is Required").isEmpty(),
//     check("lastName", "Last Name is Required").isEmpty(),
// ]