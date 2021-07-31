const { json } = require("express");

let books=[
{
    ISBN:"12345ONE",
    Title:"Getting started with Mern",
    authors:[1,2],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category:["Fiction","programming","tech","web-dev"],
    publication: 1,
},
{
    ISBN:"12345Two",
    Title:"Getting started with python",
    authors:[1,2,3],
    language: "en",
    pubDate: "2021-07-07",
    numOfPage: 225,
    category:["programming","tech","web-dev"],
    publication: 2,
},
];

let authors=[
    {
        id:1,
        name:"Ashish",
        Books:["12345ONE"],
    },
    {
        id:2,
        name:"pavan",
        Books:["12345ONE","12345Two"],
    },
];

let publications=[
    {
        id:1,
        name:"Chakra",
        Books:["12345ONE"],
    },
    {
        id:2,
        name:"chromeV-8",
        Books:["12345Two","12345ONE"],
    },
];

module.exports={books,authors,publications};


