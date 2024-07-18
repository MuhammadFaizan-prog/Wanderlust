const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  //? Init.data k undr ik obj bnaya jiske undr owner property use ho rhi for all objects for listings
  initData.data=initData.data.map((obj)=>({...obj,owner:"668f84e898fcdb9a6d4138d1"} ));

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
