//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require ("ejs");
const mongoose = require ("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

// Requests targeting ONE article----------------------
app.route("/articles/:articleTitle")
// GET ONE ARTICLE ROUTE
.get(function (req, res){
    Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
        if (foundArticle){
          console.log(foundArticle);
          res.send(foundArticle);
      } else {
        res.send("No matching articles found.");
      }
    });
  })
// Update an article route
  .put(function (req, res){
    console.log("PUT / Update requested for");
    console.log(req.params.articleTitle);

      Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        function(err, result){
          if (!err){
            console.log(result);
            res.send("Update applied.")
        } else {
          console.log(err);
          console.log(result);
          res.send("No matching articles found.");
        }
      });
    })
  ;


// Requests targeting ALL articles----------------------
app.route("/articles")
// GET ALL ARTICLES ROUTE
.get(
  function (req, res){
    Article.find(function(err, foundArticles){
        if (!err){
          console.log(foundArticles);
          res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
// POST new article ROUTE
.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added new article.");
    } else {
      res.send(err);
    }
  });
})
// DELETE article ROUTE
.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("Successfully DELETED all records.");
    } else {
      res.send(err);
    }
  });
});


//// GET ALL ARTICLES ROUTE
//app.get("/articles", function (req, res){
//  Article.find(function(err, foundArticles){
//      if (!err){
//        console.log(foundArticles);
//        res.send(foundArticles);
//    } else {
//      res.send(err);
//    }
//  });
//});
//
//// POST new article ROUTE
//app.post("/articles", function(req, res){
//  console.log(req.body.title);
//  console.log(req.body.content);
//
//  const newArticle = new Article ({
//    title: req.body.title,
//    content: req.body.content
//  });
//
//  newArticle.save(function(err){
//    if(!err){
//      res.send("Successfully added new article.");
//    } else {
//      res.send(err);
//    }
//  });
//});
//
//// DELETE article ROUTE
//app.delete("/articles", function(req, res){
//  Article.deleteMany(function(err){
//    if (!err){
//      res.send("Successfully DELETED all records.");
//    } else {
//      res.send(err);
//    }
//  });
//});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});
