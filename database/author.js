const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id:Number,
    name:String,
    Books:[String],
});

//creating the author model
const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;