const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const User=require('../models/user');

const userController = require('../controllers/user');

router.route('/signup')
//?  Show signup route
.get(userController.renderSignupForm)
//? Singup route 
.post( wrapAsync(userController.signup));


router.route('/login')
//? Show login route 
.get(userController.renderLoginForm)
//! Passport.authenticate 
//? It authenticate the login
//? We pass it strategy like hmari local thi to local
//?  Agr login fail ho to /login p redirect hojae ga (failureRedirect)
//? Agr login fail ho ga to  flash b ho ga( failureFlash)
.post(saveRedirectUrl,
    passport.authenticate('local',
         { failureFlash: true,
             failureRedirect: '/login' }),
             userController.login); 


              
router.get('/logout', userController.logout);


module.exports = router;