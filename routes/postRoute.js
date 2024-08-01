const express =require('express');
const Post = require('../models/postSchema');


const router=express.Router()

router.get('/getpost',async(req,res)=>{
  const post =await Post.find();

  res.send(post)
})

router.post('/post',async(req,res)=>{
  const {tweet,photo}=req.body;
  console.log({tweet,photo})
  const result=await Post.create({tweet,photo})

  res.send(result)
    
})



module.exports= router