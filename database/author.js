const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
        maxLength: 12,
    },
    Books:{
        type: [String],
        required: true,
    },
});

//creating the author model
const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;