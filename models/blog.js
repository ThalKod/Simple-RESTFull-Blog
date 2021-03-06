var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {
        type: Date, default: Date.now
     },
     comment:[
         {
             type: mongoose.Schema.Types.ObjectId,
             ref:"Comment"
         }
     ],
     userId:{
         type: mongoose.Schema.Types.ObjectId,
         ref:"User"
     }
}); 

var Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;

