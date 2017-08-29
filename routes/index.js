const express = require("express");
const User = require("../models/users");
const Snippet = require("../models/snippets");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

mongoose.connect("mongodb://localhost:27017/userDB");

const requireLogin = function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    next()
  } else {
    res.redirect('/');
  }
};

const login = function (req, res, next) {
  if (req.user) {
    res.redirect("/user")
  } else {
    next();
  }
};

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/",  function(req, res) {
  res.render("login");
});

router.get("/login", login, function(req, res){
  User.find({})
  .then(function(data) {
    console.log("DATA", data);
    res.render('login');
  })

  // res.render('login', { messages: res.locals.getMessages()})
})


router.get('/index', requireLogin, function(req, res){

  res.render("page")
})


router.get("/signup", function(req, res) {
  res.render("signup");
});



const bcrypt = require('bcryptjs');


router.post("/signup", function(req, res) {
  console.log(bcrypt.hashSync(req.body.password, 8));
  User.create({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,

  }).then(function(data) {
    console.log(data);
    res.redirect("/index");
  })
  .catch(function(err) {
    console.log(err);
    res.redirect("/signup");
  });
});

router.get('/edit/:id', function(req, res){
Snippet.findOne({_id: req.params.id})
.then(function(data){
  console.log("log here", req.user.id);
  if (data.createdBy === req.user.id) {
      res.render('editSnippet', data )
  }
})
.catch(function(err){
  res.redirect('/user')
})
  // res.render('editSnippet')
})

router.post('/edit/:id', function(req, res){
  console.log(req.body);
   Snippet.update({_id: req.params.id}, req.body)
   .then(function(data){
     console.log("LOOOOOOOOG");
     res.redirect('/user')
   })
   .catch(function(err){
     res.redirect('/user');
   })

})

////// deleting ...
router.get('/delete/:id', function(req, res){
Snippet.findOne({_id: req.params.id})
.then(function(data){
  console.log("log here", req.user.id);
  if (data.createdBy === req.user.id) {
      res.render('editSnippet', data)
  } else {
    res.redirect('/user')
  }
})
.catch(function(err){
  res.redirect('/page')
})
  // res.render('editSnippet')
})

router.post('/delete/:id', function(req, res){
  console.log(req.body);
   Snippet.deleteOne({_id: req.params.id})
   .then(function(data){
     console.log("LOOOOOOOOG");
     res.redirect('/user')
   })
   .catch(function(err){
     res.redirect('/user');
   })

})





router.get("/user", requireLogin, function(req, res) {

Snippet.find({})
.then(function(data){
res.render('page', {snippets : data})
})
// , username : req.user.username
.catch(function(err){
  console.log(err);
  res.redirect('login')
})

});

router.get('/create', function(req, res){
  console.log("hey i created one");
  res.render("createsnippet")
})

router.post('/create', function(req, res){

  Snippet.create({
    name : req.body.name,
    language : req.body.language,
    snippetName : req.body.snippetName,
    snippet : req.body.snippet,
    tags : [req.body.tags],
    createdBy: req.user._id
  })
  .then(function(data){
    console.log("SNIPPET", data);
    res.redirect('/user')
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/create')
  });

})

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
