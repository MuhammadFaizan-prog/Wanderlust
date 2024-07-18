const express = require('express');
//? Mergeparams true is used to get id from /listings/:id and pass it to reviews router  
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');


const  {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/review');

//? Reviews
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.index));

//? Delete review route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.delete));


module.exports=router;














