const express = require("express");
const User = require("../models/users");
const Snippet = require("../models/snippets");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require('passport');

mongoose.connect("mongodb://localhost:27017/userDB");

const requireLogin = function (req, res, next) {
  if (req.user) {
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
router.get("/",  function(req, res) {
  res.render("login");
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get("/login", login, function(req, res){
  User.find({})
  .then(function(data) {
    res.render('login');
  })

})


router.get('/index', requireLogin, function(req, res){
  res.render("page")
})

router.get('/language/:language', function(req, res){
   Snippet.find({language: req.params.language})
   .then(function(data){
     res.render('snippets',{data: data}, req.params.user)
     console.log(data);
   })
   .catch(function(err){
     console.log(err);
   })
})

router.get('/single/:id', function(req, res){
   Snippet.findById(req.params.id)
   .then(function(data){
     res.render('snippets',{data: data})
     console.log(data);
   })
   .catch(function(err){
     console.log(err);
   })
})



router.get('/tags/:tag', function(req, res){
   Snippet.find({})
   .then(function(data){
     console.log(data);
     let tagData = [];
     data.forEach(function(snip) {
       snip.tags.forEach(function(tag) {
         if (tag === req.params.tag) {
           tagData.push(snip);
         }
       })
     })
     res.render('snippets',{data: tagData}, req.params.user)
   })
   .catch(function(err){
     console.log(err);
   })
})

router.get("/signup", function(req, res) {
  res.render("signup");
});

// const bcrypt = require('bcryptjs');


router.post("/signup", function(req, res) {
  console.log(bcrypt.hashSync(req.body.password, 8));
  User.create({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,

  }).then(function(data) {
    res.redirect("/index");
  })
  .catch(function(err) {
    res.redirect("/signup");
  });
});

router.get('/editdelete/:id', function(req, res){
Snippet.findOne({_id: req.params.id})
.then(function(data){
  if (data.createdBy === req.user.id) {
    res.render('editSnippet', data )
  } else {
    res.redirect('/user')
  }
})
.catch(function(err){
  res.redirect('/user')
})

})

// WHen i edit make sure i pass in two parameters becuase
//how will the computer kno which ssnippet the user is trying to edit?
//ex. edit/:id/:language

router.post('/edit/:id', function(req, res){
  req.body.tags = req.body.tags.split(',');
  console.log("THIS LOGS IN THE CONSOLE.");
  let newArr = req.body.tags.map(function(tag) {
    console.log("tag is: '" + tag.trim() + "'.");
    return tag.trim();
  });
  req.body.tags = newArr;
   Snippet.update({_id: req.params.id}, req.body)
   .then(function(data){
     res.redirect('/user')
   })
   .catch(function(err){
     res.redirect('/user');
   })

})

////// deleting ...
// router.get('/delete/:id', function(req, res){
// Snippet.findOne({_id: req.params.id})
// .then(function(data){
//   if (data.createdBy === req.user.id) {
//       res.render('editSnippet', data)
//   } else {
//     res.redirect('/user')
//   }
// })
// .catch(function(err){
//   res.redirect('/page')
// })
//
// })

router.post('/delete/:id', function(req, res){
   Snippet.deleteOne({_id: req.params.id})
   .then(function(data){
     res.redirect('/user')
   })
   .catch(function(err){
     res.redirect('/user');
   })

})

router.get("/user", requireLogin, function(req, res) {

Snippet.find({})
.then(function(data){
  data = data.map(function(snip) {
    if (snip.createdBy === req.user._id.toString()) {
      snip.canEdit = true;
    } else {
      snip.canEdit = false;
    }
    return snip;
  })
  console.log(data[9].createdBy, req.user._id);
res.render('page', {snippets : data})
})
.catch(function(err){
  res.redirect('login')
})

});

router.get('/create', function(req, res){
  res.render("createsnippet")
})

router.post('/create', function(req, res){
  let tags = req.body.tags.split(',');
  tags = tags.map(function(tag) {
    console.log("tag is: '" + tag.trim() + "'.");
    return tag.trim();
  });

  Snippet.create({
    name : req.body.name,
    language : req.body.language,
    snippetName : req.body.snippetName,
    snippet : req.body.snippet,
    tags : tags,
    createdBy: req.user._id
  })
  .then(function(data){
    res.redirect('/user')
  })
  .catch(function(err){
    res.redirect('/create')
  });

})

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
