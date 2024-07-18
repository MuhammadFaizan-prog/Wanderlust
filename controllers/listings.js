const { application } = require('express');
const Listing = require('../models/listing');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken =process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//! All listings things
module.exports.index = async (req, res) => {
const allListings=await Listing.find({});
res.render("listings/index.ejs",{allListings})
}

module.exports.new =  (req, res) => {
    res.render("listings/new.ejs")
}


module.exports.show=async (req, res) => {
    let {id}=req.params; 
    const listing=await Listing.findById(id)
    //? Path kia h populate ka 
    //? hr reviews k sath author ko populate kr diya 
    .populate({path:'reviews',populate:{path:'author'}})
    .populate('owner');
     
    if(!listing) {
        req.flash('error', 'Listing you requested does not exist');
        res.redirect('/listings');
    }
    res.render("listings/show.ejs",{listing})
    }


 module.exports.create = async (req, res,next) => {
    

    //? Copying from forward geocode docs 
 let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
//?  1  cords ki limit 
  limit: 1
})
  .send();
//? It contains the coords
//? Features is an array so uska 0 index 
//? Geometry is an object containning coords

//? It returns the data into geojson format 
// console.log(response.body.features[0].geometry);
 
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,filename);
    //? If i dont use if here then the last app.use will handle it 
//    if(!req.body.listing) throw new ExpressError('Invalid data', 400); 


//? Easier way of these if are joi which validate schema for us   
//? You can see it in validateListing function 

//    if(!newlisting.title) throw new ExpressError('Title is required', 400); 
//    if(!newlisting.description) throw new ExpressError('Description is required', 400); 
//    if(!newlisting.price) throw new ExpressError('Price is required', 400);
//    if(!newlisting.location) throw new ExpressError('Location is required', 400);
//    if(!newlisting.country) throw new ExpressError('Country is required', 400);

    const newListing= new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};

     newListing.geometry=response.body.features[0].geometry;

  let savedListing= await newListing.save();
  console.log(savedListing);
   req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
}

module.exports.edit= async (req, res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Listing you requested does not exist');
        res.redirect('/listings');
    }


    let originalImageUrl = listing.image.url;
    //? Modify the image URL to include height and width parameters
    const url = new URL(originalImageUrl);
    url.searchParams.set('w', '250');
    url.searchParams.set('h', '150');
    const modifiedImageUrl = url.toString();
    res.render("listings/edit.ejs", { listing, modifiedImageUrl });

    }

module.exports.update=async (req, res) => {
    // if(!req.body.listing) throw new ExpressError('Invalid data', 400);
  
    let { id }=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

if(typeof req.file !== 'undefined') {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,filename);
  listing.image={url,filename};
    await listing.save();
}
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${id}`);
    }

module.exports.delete=async (req, res) => {
    let {id}=req.params;
   let deletedListing= await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash('success', 'Successfully deleted listing!');
    res.redirect('/listings');
    }



























































