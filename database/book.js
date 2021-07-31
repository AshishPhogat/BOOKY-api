const mongoose=require("mongoose");

const BookSchema=mongoose.Schema({
    ISBN:{
        type: String,
        required: true,
        minLength:8,
        maxLength:12,
    },//required  
    Title:{
        type: String,
        required: true,
        minLength:8,
        maxLength:12,
    },//required  
    authors:[Number],
    language: {
        type: String,
        required: true,
    },//required  
    pubDate: {
        type: String,
        required: true,
    },//required  
    numOfPage: {
        type: Number,
        required: true,
    },
    category:{
        type : [String],
        required: true,
    },
    publication: {
        type: Number,
        required: true,
    },
});


//creating the book model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;