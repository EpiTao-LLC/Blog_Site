//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require ("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://clarson80210:E6EbXaZ4m3UhrXZ@clarson10024.ycj6m.mongodb.net/blogDB",
  { useNewUrlParser: true,
    useUnifiedTopology: true})
    .catch('error', err => console.log(err));

const postSchema = {
  title: String,
  content: String,
  searchStr: String   //lowercase post title
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find(function(err, posts) {
    if (err) {
      console.log ("Post query ERROR:  ", err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody,
    searchStr: _.lowerCase(req.body.postTitle)
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });


});

app.get("/posts/:searchVal", function(req, res){

  const searchVal = req.params.searchVal;
  const postsArray = [];

  if (ObjectId.isValid(searchVal)) {
    if (String(new ObjectId(searchVal)) === searchVal) {
      Post.findById({_id: searchVal}, function (err, posts) {
      if (!err) {
        postsArray.push(posts);   // single value returned.  Convert to array because for post.html
        res.render("post", {
          posts: postsArray
        });
      } else {
        console.log ("findById ERROR:  ", err);
      }
      });
      } else {
        console.log ("Not a valid Object ID - 1");
      }
  } else {
    const searchVal = _.lowerCase(req.params.searchVal);
    console.log("searchVal:  ", searchVal);
    Post.find({searchStr: searchVal}, function (err, posts) {
      if (!err) {
        res.render("post", {
          startingContent: homeStartingContent,
          posts: posts
        });
      } else {
        console.log ("find by searchVal ERROR:  ", err);
      }
    });
  }
});

//process.env.PORT is for heroku  5500 is local port

let port = process.env.PORT;

if (port == null || port == ""){
  port = 5500;
}

app.listen(port, function () {
  console.log ("Server started on port:  ", port);
});
