require("dotenv").config();
// Frame Work
const express = require("express");
const mongoose=require("mongoose");

//initializing express;
const booky=express();

//configurations
booky.use(express.json());


//Establish database connection
mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
    ).then(()=>{console.log("connection established successfully !!")});


//Models


//Microservices Routes
const Books = require("./API/Book");
const Authors  = require("./API/Author");
const Publications = require("./API/Publication");


//initialzing microservices
booky.use("/book",Books);
booky.use("/author",Authors);
booky.use("/publication",Publications);


booky.listen(3000, ()=> console.log("hey,the server is running!!"));

