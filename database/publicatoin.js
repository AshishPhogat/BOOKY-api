const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
    id:Number ,
    name:String,
    Books:[String],
});

//creating the author model
const publicatioinModel = mongoose.model(PublicatoinSchema);

module.exports = publicatioinModel ;