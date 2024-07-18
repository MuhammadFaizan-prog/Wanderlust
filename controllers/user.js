const User=require('../models/user');





module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup= 
async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}


module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
}


module.exports.login=async(req, res) => {
req.flash('success', ' Welcome to Wanderlust! You are logged in');
//? if res.locals.redirectUrl does not exits then go to listings 
let redirectUrl =res.locals.redirectUrl || '/listings';
res.redirect(redirectUrl);
}

module.exports.logout= (req, res, next) => {
    req.logout((err)=> //? passport method automatically removes user from session
    {
        if(err) {
         return next(err);
        } 
    req.flash('success', 'You are logged out!');
    res.redirect('/listings');
    })
}























