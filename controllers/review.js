//! All reviews things
//? Review and Listing are actual schema 
const Listing = require('../models/listing');
const Review = require('../models/review');



module.exports.index= async (req, res) => {
 let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("New Review saved");
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/listings/${req.params.id}`);


}



module.exports.delete=async (req, res) => {
    const { id, reviewId } = req.params;
    //? pull removes the element from the array and returns the removed element. 
    //? Find it by id ,if reviewId matches reviews array it will be removed.
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/listings/${id}`);  
}