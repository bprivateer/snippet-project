const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const snippetSchema = new mongoose.Schema({
  // username: { type: String, unique: true, lowercase: true, required: true },
  // passwordHash: { type: String, required: true }
});


const User = mongoose.model("Snippet", snippetSchema);

module.exports = Snippets;
