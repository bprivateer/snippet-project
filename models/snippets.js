const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
// const Snippet =

mongoose.connect("mongodb://localhost:27017/Snippetuser");


const snippetSchema = new mongoose.Schema({
  // username : {type: String, required: true, unique:true},
  // password : {type: String, required: true},
  // name : {type: String, required: true},
  // email : {type: String, required: true}

});

const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
