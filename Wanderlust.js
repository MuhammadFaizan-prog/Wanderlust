const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const mongourl="mongodb://127.0.0.1:27017/wanderlust";
const path=require('path');
const methodOverride = require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


//? Creating a env variable named as Node_ENV
//? And storing its value as production
//? As we are not in Deployment mode
//? So we are using dotenv
//? Dont share your secret key(dotenv file)  
//? Printing Process environment variable  
//  console.log(process.env);
// console.log(process.env.SECRET);

if(process.env.NODE_ENV!='production'){
require('dotenv').config();
}

const dbUrl=process.env.ATLASDB_URL;


//? Listings files me se listings k routes nikale  and usko app .use k sath including their comman path like /listings and listing likh diya
const listingRouter=require('./routes/listings');
const reviewRouter=require('./routes/review');
const userRouter=require('./routes/user');
port = 3000;

main().then(()=>{console.log('Connected to mongodb');})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
//? Setting ejs to ejs-mate 
app.use(express.static(path.join(__dirname,'public')))

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    //? indicate when a document was last modified
    //? Apke session ki info store hoti h
    //? so u dont have to relogin again n again 
    //? when the server restarts   
    touchAfter:24 * 60 * 60 * 1000 //? 1 day
});

//? If error occurs in store then it will be printed in console 
store.on('error',(err)=>console.log(err));

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //? From Today date to after 7 days 24 hours 60 minutes 1000ms which is equal to 7 days
        expires: Date.now() +7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        //? httpOnly is used to prevent XSS attacks
        httpOnly: true,
    }
};



app.use(session(sessionOptions));
app.use(flash());
//? Middleware initializing passport 
app.use(passport.initialize());
//? Hr req ko pata ho k wo konse session ka part h
app.use(passport.session());

//? Passport k undr jo new strategy create ki h jo user ko authenticate kre gi using authenticate()
passport.use(new LocalStrategy(User.authenticate()));

//! Storing user info into session is known as serialization
//!  Unstoring user info from session is known as deserialization

//? Passport serialize user using serializeUser() 
passport.serializeUser(User.serializeUser());
//? Passport deserialize user using deserializeUser()
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash('success');

    //? res.locals.success is an empty array 
    // console.log(res.locals.success);
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

// app.get('/demouser',async (req, res) => {
//     let fakeuser = new User({username:'Demo User',email:'5RQpI@example.com'});
//     //? Using register method from passport-local-mongoose 
//     //? passing fakeuser and the password to it 
//     let registerUser=await User.register(fakeuser, 'password123');
//     res.send(registerUser);
// })


//? All in listings.js  
app.use('/listings',listingRouter);

//? ALL in review.js
//? Id idr hi ruk rhi h h wo review k pass ja hi nhi rhi 
//?   To hm id ko review tk ponchane k liye review.js k router me to we use mergerParams true
app.use("/listings/:id/reviews",reviewRouter);

app.use('/',userRouter);





//! Authentication and Authorization
//? Authentication=process of verifying who someone is
//? Authorization=process of verifying what someone can do   


//! Storing password
//? We stored password in hash format{unreadable form}
//? When user logins server converts into hash format if it matches with the stored hash format then it will be logged in 

//! Hashing functions=changes form of password into unreadable form
//? It have fixed output for every input 
//? They r 1 way functions we cant get input from output
//? small change in input can cause large change in output  


//! Salting=process of adding salt to password before hashing 
//? Adding extra 32 character strings into password then hashing 


//! Passport=library for authentication
//? 3 following things needed for passport 
//? npm i passport and npm i passport-local and 
//? npm i passport-local-mongoose IF we using mongoDb
//? For passport session is essential 
//! Passport uses pbkdf2 hashing algorithm 



//! MVC=Model,View ,Controller
//?Implement Design Pattern




//? Multer storage cloudinary=used for cloudinary storage   


//! Geocoding=process of finding latitude and longitude from address 


//! to initialize git empty repo we do git init and then git status 
//? To ignore files we dont want to push we make .gitignore file and add file names or folder names 
//? to add and commit files to git we do git add .
//? To commit files to git we do git commit -m "commit message" 


//? Form validation=>Client side(Data from front to back) 
//? and server side (Db Schema following/Error handling )

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
    let {status,message} = err;
    if(!status){
        status=500;
        message="Something went wrong";
    }
    res.status(status).render("./listings/error.ejs",{err});
});



//! Session=interaction between server and client 
//? Ik session tb tk chlta h jb tk ap ik website p ho
//? Either new tab me ho ya same tab me ho its 1 session
//? If we change browser tab then new session is created   

//! Stateful protocol=Require server to dave status and session information
//? example=File transfer protocol 

//! Stateless protocol=Server does not have to save status and session information 
//? example=Hyper text transfer protocol 



//! Express Session=Attempt to make server stateful
//? It saves info and make sesssion id 
//? Cookies me thori info save hoti h
//? So we store session ID  
//? Transfering info from 1 page to another through cookies
//? Using server.js as example 
















app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})






 










































































































