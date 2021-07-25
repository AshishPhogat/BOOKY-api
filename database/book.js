const mongoose=require("mongoose");

const BookSchema=mongoose.Schema({
    ISBN:String,
    Title:String,
    authors:[Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category:[String],
    publication: Number,
});


//creating the book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;