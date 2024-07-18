const express = require('express');
const router = express.Router();
//? It is used for restructuring the different routes into 1 file and use single line in other file 
//? Express router me se router ko extract kre fir usko app ki jagah use kr liya fir sb path define kr k router ko end p export krliya
//? Jis me sath paths hoon ge 
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, isOwner,validateListing} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudConfig');

//? Initializing multer 
//? (dest)destination is used to store images in uploads folder 
// const upload = multer({ dest: 'uploads/' })
//? Multer will store files into cloudinarystorage using cloudConfig
const upload = multer({ storage });



const listingsController = require('../controllers/listings');

//? Same routes ko ap router.route ne likh skte ho 
router.route('/',)
//? Index route
.get(wrapAsync(listingsController.index))
//? Create route
.post(isLoggedIn,
     validateListing,
     //? Name of field = listing image 
     upload.single('listing[image]'), 
     wrapAsync(listingsController.create));


//? New route 
router.get('/new', isLoggedIn, listingsController.new);

router.route('/:id',)
//? Show route
.get(wrapAsync(listingsController.show))
//? Update route 
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingsController.update))
//? Delete route    
.delete(isLoggedIn,isOwner, wrapAsync(listingsController.delete));



//? Edit route
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingsController.edit));



module.exports = router;
















































































