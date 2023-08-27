const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to Daily Journal, a digital space where ideas, stories, and inspiration converge. We're dedicated to bringing you a diverse range of content that sparks your curiosity and fuels your imagination. Whether you're a seasoned enthusiast or just starting your journey, our articles cover a wide spectrum of topics – from technology and lifestyle to travel and personal growth. Join us as we embark on a journey of discovery, knowledge, and connection. Explore our carefully crafted articles, penned by passionate writers who are excited to share their insights with you. Your adventure begins here. Let's dive in together!";
const aboutContent = "Welcome to our vibrant corner of the internet! We're a collective of curious minds, passionate about sharing ideas and sparking conversations. Our diverse team of writers brings you thought-provoking articles, inspiring stories, and insightful perspectives. Join us as we explore, learn, and connect through the power of words.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// let posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/",function(req,res){
  // res.render("home",{
  //   startingContent: homeStartingContent,
  //   posts: posts
  // });
  Post.find({}).then(function(posts){
    
    res.render("home", {startingContent: homeStartingContent, posts: posts});

  })
   .catch(function(err){
    console.log(err);
  })


});

app.get("/about",function(req,res){
  res.render("about",{about: aboutContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  // console.log(req.body.story);
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    console.error("Error saving post:", err);
    // Handle the error, e.g., return an error response
  });

  // post.save()

  // posts.push(post);
  
  res.redirect("/");
});

app.get('/post/:postId',function(req,res){
  // const requestedTitle =_.lowerCase(req.params.postId);
  const requestedPostId = req.params.postId;
  

  Post.findOne({_id: requestedPostId})
  .then((post) => {
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } 
  })
  .catch((err) => {
    console.log("error");
  });



});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
