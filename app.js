require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set('view engine', 'ejs');


const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempor eleifend sem, at commodo elit malesuada vitae. Nulla tempus enim volutpat, blandit eros blandit, dictum erat. Phasellus nec libero est. Aenean sodales eget augue ac viverra. Morbi non magna sollicitudin, tincidunt arcu in, lacinia nisl. Morbi turpis arcu, aliquam eu pellentesque nec, malesuada a odio. Sed id ornare ex. Sed eu massa diam. Nullam et ante suscipit, vehicula ex et, euismod lectus. Duis vel eros at tellus blandit accumsan at eget orci. Duis tristique vehicula urna, vitae gravida est feugiat quis. In consequat massa sit amet lacus tincidunt facilisis. Donec condimentum lectus urna, ac laoreet nibh luctus vitae. Praesent justo nisl, volutpat et mi ac, imperdiet ultrices arcu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent faucibus, enim a maximus auctor, dolor orci dictum nunc, nec bibendum justo quam nec erat.';
const contactText = "Don't Contact me. Mind your own business";
const aboutText = 'Why do you want to know about me ? Mind your own business';


const blogSchema = mongoose.Schema({
    blogHeading: String,
    blogBody: String
});

const Blog = mongoose.model("blog", blogSchema);

const blogHome = new Blog({
    blogHeading: "Home",
    blogBody: text
});



app.get("/", function (req, res) {
    Blog.find({}, function (err, foundList) {
        if (!err) {
            if (foundList.length == 0) {
                blogHome.save();
                res.redirect("/");
            }
            else {
                res.render("home", { blogs: foundList });
            }

        } else {
            console.log("some error occured");
        }
    });

});

app.get("/blogs/:blogName", function (req, res) {
    let title = req.params.blogName;
    Blog.findOne({ blogHeading: title }, function (err, foundBlog) {
        if (!err) {
            console.log(foundBlog);
            res.render("post", {
                blogHeading: foundBlog.blogHeading,
                blogBody: foundBlog.blogBody,
            });
        } else {
            console.log("Error");
        }
    });
});

app.get("/about", function (req, res) {
    res.render("post", { blogHeading: "About", blogBody: aboutText });
});

app.get("/contact", function (req, res) {
    res.render("post", { blogHeading: "Contact", blogBody: contactText });
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {

    let blogHeading = req.body.blogHeading;
    let blogBody = req.body.blogBody;

    let blog = new Blog({
        blogHeading: blogHeading,
        blogBody: blogBody
    });

    blog.save();

    res.redirect("/");
    console.log(blogHeading);

});

let port = process.env.PORT;
if (port == null)
    port = 3000;

app.listen(port, function () {
    console.log("Server started on port on 3000");
});