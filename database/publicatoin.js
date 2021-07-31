const mongoose = require("mongoose");

const PublicationSchema = mongoose.Schema({
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
const publicatioinModel = mongoose.model("publications",PublicationSchema);

module.exports = publicatioinModel ;

