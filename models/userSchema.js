const mongoose =require('mongoose');

const userSchema=new mongoose.Schema({

  username:{
    type:String,
    required:true,
    minLength:[3,'username should have at least 3 characters']
  },
  name:{
    type:String,
    required:true,
    minLength:[3,'name should have at least 3 characters']
  },
  email:{
    type:String,
    required:true,
    
  },
  password:{
    type:String,
    required:true,
    minLength:[6,'password should have at least 3 characters']
  },
  coverImage:{
    type:String,
    
  },
  profileImage:{
    type:String,
    
  },
  dob:{
    type:String,
    
  },
  website:{
    type:String,
    
  },
  location:{
    type:String,
    
  },
  bio:{
    type:String,
    
  },


},{timestamps:true})

const User=mongoose.model('user',userSchema);

module.exports=User