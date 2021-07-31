//initializing the express route
const Router = require("express").Router();  


//Database Routes
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");
const PublicationModel = require("../../database/publicatoin");

//authors;


/*
Route                           /author
Description                     get all authors
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
Router.get("/",async (req,res)=>{
    try{
        const getAllAuthors = await AuthorModel.find();
    //hello change
    return res.json({authors : getAllAuthors});
    }catch(error){
        return res.json({error : error.message});
    }
});

/*
Route                           /author
Description                     get specific author based on id
Access                          PUBLIC
Parameters                      id
method                          GET

*/

Router.get("/:id",async (req,res)=>{
   
    try{
        const getSpecificAuthors = await AuthorModel.findOne({id : parseInt(req.params.id)});
        // const getSpecificAuthor=database.authors.filter((author)=>{
        //         return author.id === parseInt(req.params.id);
        // });
        if(! getSpecificAuthors){
            return res.json({error : `no author found with the id of ${req.params.id}`});
        }
    
        return res.json({author : getSpecificAuthors});
    }catch(error){
        return res.json({error : error.message});
    }
});

/*
Route                           /author/is
Description                     get list of  authors based on book
Access                          PUBLIC
Parameters                      isbn
method                          GET

*/
Router.get("/is/:isbn",async (req,res)=>{
    
    try{
        const getAuthors = await AuthorModel.find({Books: req.params.isbn});
    // const getAuthors =database.authors.filter((author)=>{
    //     return author.Books.includes(req.params.isbn);
    // });
    if(! getAuthors){
        return res.json({error : `no author found for the book with isbn as ${req.params.isbn}`});
    }

    return res.json({authors : getAuthors});
    }catch(error){
        return res.json({error : error.message});
    }
});

/*
Route                           /author/new
Description                     add new author
Access                          PUBLIC
Parameters                      NONE
method                          POST

*/
Router.post("/new",async (req,res)=>{
    
    try{
        //requesting a new author from the body
    const {newAuthor}=req.body;

    // adding a new author to the database
    await AuthorModel.create(newAuthor);

    return res.json({authors : {},message : "new author was added !!"});
    }catch(error){
        return res.json({error : error.message});
    }
});

/*
Route                           /author/book/update
Description                     update new book to authors
Access                          PUBLIC
Parameters                      id
method                          PUT

*/
Router.put("/book/update/:id",async (req,res)=>{
    
    try{
        //updating the author
    const updateAuthors = await AuthorModel.findOneAndUpdate(
        {
            id : req.params.id,
        },
        {
            $addToSet: {
                Books : req.body.ISBN,
            },
        },
        {
            new : true,
        }
    );
    // database.authors.forEach((author)=>{
    //     if(author.id === parseInt(req.params.id)){
    //         author.Books.push(req.body.ISBN);
    //         return;
    //     }
    // });

    //updating the books
    const updateBooks = await BookModel.findOneAndUpdate(
        {
            ISBN : req.body.ISBN,
        },
        {
            $addToSet : {
                authors : req.params.id,
            },
        },
        {
            new : true,
        }
    );
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.body.ISBN){
    //         book.authors.push(parseInt(req.params.id));
    //         return ;
    //     }
    // });

    return res.json({books : updateBooks,authors : updateAuthors, message : "the author was updated"});
    }catch(error){
        return res.json({error : error.message});
    }
});


/*
Route                           /author/delete
Description                     deleting an author 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
Router.delete("/delete/:id",async (req,res)=>{
    try{
        const udpateAuthors = await AuthorModel.findOneAndDelete(
            { id : req.params.id}
        );
        // const updatedDatabase=database.authors.filter((author)=>{
        //     return author.id !== parseInt(req.params.id);
        // });
    
        // database.authors=updatedDatabase;
    
        return res.json({authors : updateAuthors,message : `the authors with id ${req.params.id} was deleted`});
    }catch(error){
        return res.json({error : error.message});
    }

});

module.exports = Router ;