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
const PublicationModle = require("./database/publicatoin");



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
    console.log(getallbooks);
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

booky.get("/c/:category",(req,res)=>{

    const getSpecificBooks=database.books.filter((book)=>{
        return book.category.includes(req.params.category);
     });
     if(getSpecificBooks.length ===0){
         return res.json({error : `no book found for the category of ${req.params.category}`});
     }
 
     return res.json({book : getSpecificBooks});
});

/*
Route                           /a
Description                     get specific book based on authors
Access                          PUBLIC
Parameters                      author
method                          GET

*/
booky.get("/a/:author",(req,res)=>{
    const getSpecificBooks=database.books.filter((book)=>{
           return  book.authors.includes(parseInt(req.params.author));
    });
    if(getSpecificBooks.length === 0){
        return res.json({error : `no book found for the author ${req.params.author}`});
    }

    return res.json({books : getSpecificBooks});
});

/*
Route                           /book/new
Description                     add new books
Access                          PUBLIC
Parameters                      NONE
method                          POST

*/
booky.post("/book/new",(req,res)=>{
    //requesting a new body of book
    const {newBook}=req.body;

    //adding to the database
    database.books.push(newBook);

    return res.json({books : database.books,message : "book was added !!"});
});

/*
Route                           /book/update
Description                     update book title
Access                          PUBLIC
Parameters                      isbn
method                          PUT

*/
booky.put("/book/update/:isbn",(req,res)=>{
    //foreach direclty modifies the array
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn)
        {
            book.Title = req.body.BookTitle;
            return ;
        }
    });

    return res.json({books : database.books, message : "the book title was updates !!"});
});

/*
Route                           /book/author/update
Description                     update/add new author
Access                          PUBLIC
Parameters                      isbn
method                          PUT

*/
booky.put("/book/author/update/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
         book.ISBN !== req.params.isbn;
    });

    database.authors.forEach((author)=>{
        if(author.id === req.body.newAuthor){
            author.Books.push(req.params.isbn);
        }
        return ;
    });

    return res.json({books : database.books , authors : database.authors,message : "new author was added"});
});

/*
Route                           /book/delete
Description                     deleting a book
Access                          PUBLIC
Parameters                      isbn
method                          DELETE

*/
booky.delete("/book/delete/:isbn",(req,res)=>{
    const updatedDatabase=database.books.filter((book)=>{
        if(book.ISBN !== req.params.isbn){
            return book;
        }
    });

    database.books=updatedDatabase;
    return res.json({books : database.books,message : `the book with isbn ${req.params.isbn} was deleted`});
});

/*
Route                           /book/author/delete
Description                     deleting an author from a book
Access                          PUBLIC
Parameters                      isbn
method                          DELETE

*/
booky.delete("/book/author/delete/:isbn",(req,res)=>{
    database.books.forEach((book)=>{
        if(book.ISBN === req.params.isbn)
        {
           const updatedAuthorList=book.authors.filter((author)=>{
              return  author !== req.body.Author;
           });
           book.authors=updatedAuthorList;
           return ;
        }
    });

    database.authors.forEach((author)=>{
        if(author.id === req.body.Author){
            const updatedBookList=author.Books.filter((book)=>{
                    return book !== req.params.isbn;
            });
            author.Books=updatedBookList;
        }
        return ;
    });

    return res.json({books : database.books,authors : database.authors,message : `the author ${req.body.Author} is removed`});
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
booky.get("/author",(req,res)=>{
    //hello change
    return res.json({authors : database.authors});
});

/*
Route                           /author
Description                     get specific author based on id
Access                          PUBLIC
Parameters                      id
method                          GET

*/

booky.get("/author/:id",(req,res)=>{
    getSpecificAuthor=database.authors.filter((author)=>{
            return author.id === parseInt(req.params.id);
    });
    if(getSpecificAuthor.length === 0){
        return res.json({error : `no author found with the id of ${req.params.id}`});
    }

    return res.json({author : getSpecificAuthor});
});

/*
Route                           /author/is
Description                     get list of  authors based on book
Access                          PUBLIC
Parameters                      isbn
method                          GET

*/
booky.get("/author/is/:isbn",(req,res)=>{
    getAuthors=database.authors.filter((author)=>{
        return author.Books.includes(req.params.isbn);
    });
    if(getAuthors.length === 0){
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
booky.post("/author/new",(req,res)=>{
    //requesting a new author from the body
    const {newAuthor}=req.body;

    // adding a new author to the database
    database.authors.push(newAuthor);

    return res.json({authors : database.authors,message : "new author was added !!"});
});

/*
Route                           /author/book/update
Description                     update new book to authors
Access                          PUBLIC
Parameters                      id
method                          PUT

*/
booky.put("/author/book/update/:id",(req,res)=>{
    //updating the author
    database.authors.forEach((author)=>{
        if(author.id === parseInt(req.params.id)){
            author.Books.push(req.body.ISBN);
            return;
        }
    });

    //updating the books
    database.books.forEach((book)=>{
        if(book.ISBN === req.body.ISBN){
            book.authors.push(parseInt(req.params.id));
            return ;
        }
    });

    return res.json({books : database.books,authors : database.authors, message : "the author was updated"});
});


/*
Route                           /author/delete
Description                     deleting an author 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
booky.delete("/author/delete/:id",(req,res)=>{

    const updatedDatabase=database.authors.filter((author)=>{
        return author.id !== parseInt(req.params.id);
    });

    database.authors=updatedDatabase;

    return res.json({authors : database.authors,message : `the authors with id ${req.params.id} was deleted`});

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
booky.get("/publication",(req,res)=>{

    const getPublications=database.publications;
    return res.json({publications : getPublications});
});

/*
Route                           /publication
Description                     get specific publication based on id
Access                          PUBLIC
Parameters                      id
method                          GET

*/
booky.get("/publication/:id",(req,res)=>{

    getSpecificPublication=database.publications.filter((publication)=>{
        return publication.id === parseInt(req.params.id);
    });

    if(getSpecificPublication.length === 0){
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
booky.get("/publication/is/:isbn",(req,res)=>{
    const getSpecificPublications =database.publications.filter((publication)=>{
        return publication.Books.includes(req.params.isbn);
    });

    if(getSpecificPublications.length === 0){
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
booky.post("/publication/new",(req,res)=>{
    // requesting a new publicaion from the body
    const {newPublication} = req.body;
    
    //adding a new publication to the database
    database.publications.push(newPublication);

    return res.json({publications : database.publications,message : "new publications was added !!"});
});

/*
Route                           /publication/update
Description                     update name in publication
Access                          PUBLIC
Parameters                      id
method                          PUT

*/
booky.put("/publication/update/:id",(req,res)=>{
    //updating the name in publication
    database.publications.forEach((publication)=>{
        if(publication.id === parseInt(req.params.id)){
            publication.name = req.body.name;
            return;
        }
    });

    return res.json({publications : database.publications,message : "the name of the publication was upadted"});
});

/*
Route                           /publication/book/update
Description                     update book in publication
Access                          PUBLIC
Parameters                      id
method                          PUT

*/

booky.put("/publication/book/update/:id",(req,res)=>{
    //updating the publication 
    database.publications.forEach((publication)=>{
        if(publication.id === parseInt(req.params.id)){
            publication.Books.push(req.body.ISBN);
            return ;
        }
    });

    //updating the books
    database.books.forEach((book)=>{
        if(book.ISBN === req.body.ISBN){
            book.publication = parseInt(req.params.id);
            return ;
        }
    });

    return res.json({books : database.books,publications : database.publications,message : "the publication was updated"});
});

/*
Route                           /publication/delete
Description                     deleting an publication 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
booky.delete("/publication/delete/:id",(req,res)=>{

    const updatedDatabase=database.publications.filter((publication)=>{
        return publication.id !== parseInt(req.params.id);
    });

    database.publications=updatedDatabase;

    return res.json({publications: database.publications,message : `the publication with id ${req.params.id} was deleted`});

});

/*
Route                           /publication/book/delete
Description                     deleting an publication 
Access                          PUBLIC
Parameters                      id
method                          DELETE

*/
booky.delete("/publication/book/delete/:id",(req,res)=>{
    //updating the publication database
    database.publications.forEach((publication)=>{
        if(publication.id === parseInt(req.params.id))
        {
            const updatedBookList=publication.Books.filter((book)=>{
                if(book !== req.body.ISBN){
                    return book;
                }
            });
            publication.Books=updatedBookList;
            return ;
        }
        //updating the book database
    database.books.forEach((book)=>{
        if(book.ISBN === req.body.ISBN){
            if(book.publication === parseInt(req.params.id))
            {
                book.publication=-1;
            }
            return ;
        }
    });

        return res.json({ books : database.books,publications : database.publications,message : `book with isbn ${req.body.ISBN} was removed !!`});
    });
});



booky.listen(3000, ()=> console.log("hey,the server is running!!"));