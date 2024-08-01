const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  tweet: {
    type: String,
    
  },
  photo: {
    type: String,
  },
  name:{
    type:String
  },
  username:{
    type:String
  },
  email:{
    type:String
  },
  profilePhoto:{
    type:String
  }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
