//initializing express Router
const Router = require("express").Router();

//Database Routes
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");
const PublicationModel = require("../../database/publicatoin");

// publications;

/*
Route                           /publication
Description                     get all publications
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
Router.get("/",async (req,res)=>{

    const getPublications = await PublicationModel.find();
    // const getPublications=database.publications;
    return res.json({publications : getPublications});
});

/*
Route                           /publication
Description                     get specific publication based on id
Access                          PUBLIC
Parameters                      id
method                          GET

*/
Router.get("/:id",async (req,res)=>{

    const getSpecificPublication = await PublicationModel.findOne({id : req.params.id});
    // getSpecificPublication=database.publications.filter((publication)=>{
    //     return publication.id === parseInt(req.params.id);
    // });

    if(! getSpecificPublication){
        return res.json({error : `no publication found with id as ${req.params.id}`});
    }

    return res.json({ publication : getSpecificPublication});
});

/*
Route                           /publication/is
Description                     get specific publication based on book
Access                          PUBLIC
Parameters                      isbn
method                          GET

*/
Router.get("/is/:isbn",async (req,res)=>{
    const getSpecificPublications = await PublicationModel.find({Books : req.params.isbn});
    // const getSpecificPublications =database.publications.filter((publication)=>{
    //     return publication.Books.includes(req.params.isbn);
    // });

    if(! getSpecificPublications){
        return res.json({error : `no publication found for the book with isbn as ${req.params.isbn}`});
    }

    return res.json({publications : getSpecificPublications});
});

/*
Route                           /publication/new
Description                     add new publication
Access                          PUBLIC
Parameters                      NONE
method                          POST

*/
Router.post("/new",async (req,res)=>{
    // requesting a new publicaion from the body
    const {newPublication} = req.body;
    
    //adding a new publication to the database
    await PublicationModel.create(newPublication);
    // database.publications.push(newPublication);

    return res.json({publications : {},message : "new publications was added !!"});
});

/*
Route                           /publication/update
Description                     update name in publication
Access                          PUBLIC
Parameters                      id
method                          PUT

*/
Router.put("/update/:id",async (req,res)=>{
    //updating the name in publication
    const updatePublications = await PublicationModel.findOneAndUpdate(
        {
            id : req.params.id,
        },
        {
            name : req.body.name,
        },
        {
            new : true,
        }
    );
    // database.publications.forEach((publication)=>{
    //     if(publication.id === parseInt(req.params.id)){
    //         publication.name = req.body.name;
    //         return;
    //     }
    // });

    return res.json({publications : updatePublications,message : "the name of the publication was upadted"});
});

/*
Route                           /publication/book/update
Description                     update book in publication
Access                          PUBLIC
Parameters                      id
method                          PUT

*/

Router.put("/book/update/:id",async (req,res)=>{
    //updating the publication 
    const updatePublications = await PublicationModel.findOneAndUpdate(
        {
            id : parseInt(req.params.id),
        },
        {
            Books : req.body.ISBN,
        },
        {
            new : true,
        }
    );
    // database.publications.forEach((publication)=>{
    //     if(publication.id === parseInt(req.params.id)){
    //         publication.Books.push(req.body.ISBN);
    //         return ;
    //     }
    // });

    //updating the books
    const updateBooks = await BookModel.findOneAndUpdate(
        {
            ISBN : req.body.ISBN,
        },
        {
            publication :parseInt(req.body.id),
        },
        {
            new : true,
        }
    );
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.body.ISBN){
    //         book.publication = parseInt(req.params.id);
    //         return ;
    //     }
    // });

    return res.json({books : updateBooks,publications : updatePublications,message : "the publication was updated"});
});

/*
Route                           /publication/delete
Description                     deleting an publication 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
Router.delete("/delete/:id",async (req,res)=>{

    const updatePublications = await PublicationModel.findOneAndDelete(
        {id : req.params.id}
    );
    // const updatedDatabase=database.publications.filter((publication)=>{
    //     return publication.id !== parseInt(req.params.id);
    // });

    // database.publications=updatedDatabase;

    return res.json({publications: updatePublications,message : `the publication with id ${req.params.id} was deleted`});

});

/*
Route                           /publication/book/delete
Description                     deleting an publication 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
Router.delete("/book/delete/:id",async (req,res)=>{
    //updating the publication database
    const updatePublications = await PublicationModel.findOneAndUpdate(
        {
            id : req.params.id,
        },
        {
            $pull : {
                ISBN : req.body.ISBN,
            },
        },
        {
            new : true,
        }
    );
    // database.publications.forEach((publication)=>{
    //     if(publication.id === parseInt(req.params.id))
    //     {
    //         const updatedBookList=publication.Books.filter((book)=>{
    //             if(book !== req.body.ISBN){
    //                 return book;
    //             }
    //         });
    //         publication.Books=updatedBookList;
    //         return ;
    //     }
        //updating the book database
    const updateBooks = await BookModel.findOneAndUpdate(
        {
            ISBN : req.body.ISBN ,
        },
        {
            $set : {
                publication : -1,
            }
        },
        {
            new : true,
        }
    );
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.body.ISBN){
    //         if(book.publication === parseInt(req.params.id))
    //         {
    //             book.publication=-1;
    //         }
    //         return ;
    //     }
    // });

        return res.json({ books : updateBooks,publications : updatePublications,message : `book with isbn ${req.body.ISBN} was removed !!`});
});

module.exports = Router ;