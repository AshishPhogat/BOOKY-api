//initializing the express router 
const Router = require("express").Router();

//Database Routes
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");
const PublicationModel = require("../../database/publicatoin");

//books;

/*
Route                           /
Description                     get all books
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
Router.get("/",async(req,res)=>{
    const getallbooks=await BookModel.find();
    //hello change
    return res.json({books : getallbooks});
});

/*
Route                           /
Description                     get specific book based on isbn
Access                          PUBLIC
Parameters                      isbn
method                          GET

*/
Router.get("/is/:isbn",async(req,res)=>{

    const getSpecificBook = await BookModel.findOne({ISBN : req.params.isbn});

    // const getSpecificBook=database.books.filter((book)=>{
    //    return book.ISBN === req.params.isbn;
    // });

    //if mongodb doesn't find your data it reutrns -> null
    if(!getSpecificBook){
        return res.json({error : `no book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book : getSpecificBook});

});

/*
Route                           /c
Description                     get specific book based on category
Access                          PUBLIC
Parameters                      category
method                          GET

*/

Router.get("/c/:category",async (req,res)=>{

    const getSpecificBooks = await BookModel.find({category : req.params.category});
    // const getSpecificBooks=database.books.filter((book)=>{
    //     return book.category.includes(req.params.category);
    //  });
     if(! getSpecificBooks){
         return res.json({error : `no book found for the category of ${req.params.category}`});
     }
 
     return res.json({books : getSpecificBooks});
});

/*
Route                           /a
Description                     get specific book based on authors
Access                          PUBLIC
Parameters                      author
method                          GET

*/
Router.get("/a/:author",async (req,res)=>{

    const getSpecificBooks = await BookModel.find({authors : req.params.author });
    // const getSpecificBooks=database.books.filter((book)=>{
    //        return  book.authors.includes(parseInt(req.params.author));
    // });
    if( !getSpecificBooks ){
        return res.json({error : `no book found for the author ${req.params.author}`});
    }

    return res.json({books : getSpecificBooks});
});

/*
Route                           /p
Description                     get specific book based on publications
Access                          PUBLIC
Parameters                      publication
method                          GET

*/

Router.get("/p/:publication",async (req,res)=>{

    const getSpecificBooks = await BookModel.find({publication : parseInt(req.params.publication)});
    // const getSpecificBooks = database.books.filter((book)=>{
    //      return   book.publication = parseInt(req.params.publication);
    // });

    if(! getSpecificBooks){
        return res.json({error : `no book found with publication as ${req.params.publication}` });
    }

    return res.json({books : getSpecificBooks });
});

/*
Route                           /book/new
Description                     add new books
Access                          PUBLIC
Parameters                      NONE
method                          POST

*/
Router.post("/new",async(req,res)=>{
    //requesting a new body of book
    const {newBook}=req.body;

    //adding to the database
     await BookModel.create(newBook);

    return res.json({books : {},message : "book was added !!"});
});

/*
Route                           /book/update
Description                     update book title
Access                          PUBLIC
Parameters                      isbn
method                          PUT

*/
Router.put("/update/:isbn",async (req,res)=>{
    const updateBooks = await BookModel.findOneAndUpdate(
    {
        ISBN : req.params.isbn,
    },
    {
        Title : req.body.BookTitle,
    },
    {
        new : true ,
    }
    );
    //foreach direclty modifies the array
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn)
    //     {
    //         book.Title = req.body.BookTitle;
    //         return ;
    //     }
    // });

    return res.json({books : updateBooks, message : "the book title was updates !!"});
});

/*
Route                           /book/author/update
Description                     update/add new author
Access                          PUBLIC
Parameters                      isbn
method                          PUT

*/
Router.put("/author/update/:isbn",async (req,res)=>{
    //updating the books database;
    const updateBooks = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
           $addToSet: {
               authors : parseInt(req.body.newAuthor),
           }
        },
        {
            new : true,
        }
        );
    // database.books.forEach((book)=>{
    //      if(book.ISBN === req.params.isbn)
    //      {
    //          book.authors.push(parseInt(req.body.newAuthor));
    //          return ;
    //      }
    // });
        //updating the authors database;
        const updateAuthors = await AuthorModel.findOneAndUpdate(
            {
                id : req.body.newAuthor,
            },
            {
                $addToset: {
                    Books : req.params.isbn,
                },
            },
            {
                new : true,
            }
        );
    // database.authors.forEach((author)=>{
    //     if(author.id === req.body.newAuthor){
    //         author.Books.push(req.params.isbn);
    //     }
    //     return ;
    // });

    return res.json({books : updateBooks , authors : updateAuthors,message : "new author was added"});
});

/*
Route                           /book/delete
Description                     deleting a book
Access                          PUBLIC
Parameters                      isbn
method                          DELETE

*/
Router.delete("/delete/:isbn",async (req,res)=>{
    const updateBooks = await BookModel.findOneAndDelete({
        ISBN : req.params.isbn,
    });
    // const updatedDatabase=database.books.filter((book)=>{
    //     if(book.ISBN !== req.params.isbn){
    //         return book;
    //     }
    // });

    // database.books=updatedDatabase;
    return res.json({books : updateBooks,message : `the book with isbn ${req.params.isbn} was deleted`});
});

/*
Route                           /book/author/delete
Description                     deleting an author from a book
Access                          PUBLIC
Parameters                      isbn
method                          DELETE

*/
Router.delete("/author/delete/:isbn",async (req,res)=>{
    //update the books;
    const updateBooks = await BookModel.findOneAndUpdate(
        {
            ISBN : req.params.isbn,
        },
        {
            $pull : {
                authors : req.body.Author,
            },  
        },
        {
            new : true,
        }
    );
    // database.books.forEach((book)=>{
    //     if(book.ISBN === req.params.isbn)
    //     {
    //        const updatedAuthorList=book.authors.filter((author)=>{
    //           return  author !== req.body.Author;
    //        });
    //        book.authors=updatedAuthorList;
    //        return ;
    //     }
    // });

    //updating the author details ;
    const updateAuthors = await AuthorModel.findOneAndUpdate(
        {
            id : req.body.Author,
        },
        {
            Books : req.params.isbn,
        },
        {
            new : true,
        }
    );

    // database.authors.forEach((author)=>{
    //     if(author.id === req.body.Author){
    //         const updatedBookList=author.Books.filter((book)=>{
    //                 return book !== req.params.isbn;
    //         });
    //         author.Books=updatedBookList;
    //     }
    //     return ;
    // });

    return res.json({books : updateBooks,authors : updateAuthors,message : `the author ${req.body.Author} is removed`});
});


module.exports = Router ;