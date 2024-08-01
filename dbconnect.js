
const mongoose = require('mongoose');


const dbConnect=async()=>{
  try {
    const uri = process.env.DB_URI;
   const res=await mongoose.connect(uri)

   if(res){
    console.log("mongodb connected succesfully")
   }
  } catch (error) {
    console.log(error)
  }

   



}

module.exports =dbConnect;

