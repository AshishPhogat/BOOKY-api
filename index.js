require("dotenv").config();
// Frame Work
const express = require("express");
const mongoose=require("mongoose");

//Database
const database=require("./database/index");

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
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publicatoin");
const { parse } = require("dotenv");
const publicatioinModel = require("./database/publicatoin");
const { findOneAndUpdate } = require("./database/book");



//books;

/*
Route                           /
Description                     get all books
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
booky.get("/",async(req,res)=>{
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
booky.get("/is/:isbn",async(req,res)=>{

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

booky.get("/c/:category",async (req,res)=>{

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
booky.get("/a/:author",async (req,res)=>{

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

booky.get("/p/:publication",async (req,res)=>{

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
booky.post("/book/new",async(req,res)=>{
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
booky.put("/book/update/:isbn",async (req,res)=>{
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
booky.put("/book/author/update/:isbn",async (req,res)=>{
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
booky.delete("/book/delete/:isbn",async (req,res)=>{
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
booky.delete("/book/author/delete/:isbn",async (req,res)=>{
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

//---------------------------------------------------------------------------------------------------------------


//authors;

/*
Route                           /author
Description                     get all authors
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
booky.get("/author",async (req,res)=>{
    const getAllAuthors = await AuthorModel.find();
    //hello change
    return res.json({authors : getAllAuthors});
});

/*
Route                           /author
Description                     get specific author based on id
Access                          PUBLIC
Parameters                      id
method                          GET

*/

booky.get("/author/:id",async (req,res)=>{
    const getSpecificAuthors = await AuthorModel.findOne({id : parseInt(req.params.id)});
    // const getSpecificAuthor=database.authors.filter((author)=>{
    //         return author.id === parseInt(req.params.id);
    // });
    if(! getSpecificAuthors){
        return res.json({error : `no author found with the id of ${req.params.id}`});
    }

    return res.json({author : getSpecificAuthors});
});

/*
Route                           /author/is
Description                     get list of  authors based on book
Access                          PUBLIC
Parameters                      isbn
method                          GET

*/
booky.get("/author/is/:isbn",async (req,res)=>{
    const getAuthors = await AuthorModel.find({Books: req.params.isbn});
    // const getAuthors =database.authors.filter((author)=>{
    //     return author.Books.includes(req.params.isbn);
    // });
    if(! getAuthors){
        return res.json({error : `no author found for the book with isbn as ${req.params.isbn}`});
    }

    return res.json({authors : getAuthors});
});

/*
Route                           /author/new
Description                     add new author
Access                          PUBLIC
Parameters                      NONE
method                          POST

*/
booky.post("/author/new",async (req,res)=>{
    //requesting a new author from the body
    const {newAuthor}=req.body;

    // adding a new author to the database
    await AuthorModel.create(newAuthor);

    return res.json({authors : {},message : "new author was added !!"});
});

/*
Route                           /author/book/update
Description                     update new book to authors
Access                          PUBLIC
Parameters                      id
method                          PUT

*/
booky.put("/author/book/update/:id",async (req,res)=>{
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
});


/*
Route                           /author/delete
Description                     deleting an author 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
booky.delete("/author/delete/:id",async (req,res)=>{
    const udpateAuthors = await AuthorModel.findOneAndDelete(
        { id : req.params.id}
    );
    // const updatedDatabase=database.authors.filter((author)=>{
    //     return author.id !== parseInt(req.params.id);
    // });

    // database.authors=updatedDatabase;

    return res.json({authors : updateAuthors,message : `the authors with id ${req.params.id} was deleted`});

});
//---------------------------------------------------------------------------------------------------------------


// publications;

/*
Route                           /publication
Description                     get all publications
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
booky.get("/publication",async (req,res)=>{

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
booky.get("/publication/:id",async (req,res)=>{

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
booky.get("/publication/is/:isbn",async (req,res)=>{
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
booky.post("/publication/new",async (req,res)=>{
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
booky.put("/publication/update/:id",async (req,res)=>{
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

booky.put("/publication/book/update/:id",async (req,res)=>{
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
booky.delete("/publication/delete/:id",async (req,res)=>{

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
booky.delete("/publication/book/delete/:id",async (req,res)=>{
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




booky.listen(3000, ()=> console.log("hey,the server is running!!"));