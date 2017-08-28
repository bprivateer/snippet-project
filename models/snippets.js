const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/Snippetuser");


const snippetSchema = new mongoose.Schema({
  // username : {type: String, required: true, unique:true},
  // password : {type: String, required: true},
  // name : {type: String, required: true},
  // email : {type: String, required: true}

});

const User = mongoose.model("Snippet", snippetSchema);

module.exports = Snippets;
