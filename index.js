const express = require('express')
const bcryptjs=require('bcryptjs')
const cors=require('cors')
const dotenv=require('dotenv');
const dbConnect = require('./dbconnect');
const cookieParser=require('cookie-parser');
const Post = require('./models/postSchema');



const User = require('./models/userSchema');
const app = express()
dotenv.config();

const stripe=require("stripe")(process.env.SECRET_KEY);


//middlewares
app.use(cors({
  origin:['http://localhost:5173'],
  methods:['POST','GET','PATCH','DELETE'],
  credentials:true,
  
}))
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.json()); 

app.use('/api/v1/post',async(req,res)=>{
  const {tweet,photo,profilePhoto,email,name,username}=req.body;
  console.log({tweet,photo,profilePhoto,email,name,username})
  const result=await Post.create({tweet,photo,profilePhoto,email,name,username});

  res.send(result)
    
})

app.use('/api/v1/register',async(req,res)=>{
  const {email,name,username,password}=req.body;

  const salt=await bcryptjs.genSalt(10);
  const hashedPassword=await bcryptjs.hash(password,salt);
  
  console.log(email,name,username,hashedPassword)
  const result=await User.create({email,name,username,password:hashedPassword})

  res.send(result)
    
})
app.get('/api/v1/getpost',async(req,res)=>{
  const post =await Post.find().sort({ _id: -1 }).exec();
  
  res.send(post)
})

app.get('/api/v1/user',async(req,res)=>{
  const user =await User.find();

  res.send(user)
})
app.get('/api/v1/user-data',async(req,res)=>{
  const email =req.query.email;
  
  const user=await User.findOne({email:email})
  
  res.send(user)

})

//user post
app.get('/api/v1/userPost',async(req,res)=>{
  const email =req.query.email;
  
  const post=await Post.find({email:email}).sort({ _id: -1 }).exec();
 
  res.send(post)

})

//patch

app.patch('/api/v1/userUpdates', async (req, res) => {
  const email = req.query.email;
  const { coverImage } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const result = await User.updateOne(
        { email: email },         // Filter criteria
        { $set: { coverImage: coverImage } }  // Update operation
      );
      res.send(result);
      // console.log(result)
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});



app.patch('/api/v1/user_profile', async (req, res) => {
  const email = req.query.email;
  const { profileImage } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user)
    if (user) {
      const result = await User.updateOne(
        { email: email },         // Filter criteria
        { $set: { profileImage: profileImage } }  // Update operation
      );
      res.send(result);
      // console.log(result)
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});


app.patch('/api/v1/edit-info', async (req, res) => {
  const email = req.query.email;
  const { name, bio, dob, website, location } = req.body;

  try {
    const result = await User.findOneAndUpdate(
      { email: email },
      { $set: { name, bio, location, website, dob } },
      { new: true, useFindAndModify: false }
    );

    console.log(result)

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/v1/create-payment',async(req,res)=>{
   const body=req.body;

   const lineItems=[
    {price_data:{
      currency:"inr",
      product_data:{
        name:body.name
      },
      unit_amount:body.payment*100,
    },
    quantity:1}
   ]
   
   const session=await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    line_items:lineItems,
    mode:"payment",
    success_url:"http://localhost:5173/home/feed",
    cancel_url:"http://localhost:5173/home/bookmarks"

   })
   res.json({id:session.id})
})



// database connection
dbConnect();

const port=process.env.PORT||5000;
app.listen(port ,()=>{
     console.log(`server running on port no. ${port}`)
})