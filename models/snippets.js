const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
// const Snippet =

mongoose.connect("mongodb://localhost:27017/Snippetuser");


const snippetSchema = new mongoose.Schema({
  name : {type: String, lowercase: true},
  language : { type: String},
  snippetName : {type: String, required: false},
  snippet : {type: String, required: false},
  tags : {type: [String], lowercase: true},
  createdBy: {type: String, required: true}


});

const Snippet = mongoose.model("Snippet", snippetSchema);

module.exports = Snippet;
