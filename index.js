const express = require("express");

//Database
const database=require("./database/index");

//initializing express;
const booky=express();

//configurations
booky.use(express.json());


//books;

/*
Route                           /
Description                     get all books
Access                          PUBLIC
Parameters                      NONE
method                          GET

*/
booky.get("/",(req,res)=>{
    //hello change
    return res.json({books : database.books});
});

/*
Route                           /
Description                     get specific book based on isbn
Access                          PUBLIC
Parameters                      isbn
method                          GET

*/
booky.get("/is/:isbn",(req,res)=>{

    const getSpecificBook=database.books.filter((book)=>{
       return book.ISBN === req.params.isbn;
    });
    if(getSpecificBook.length ===0){
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


booky.listen(3000, ()=> console.log("hey,the server is running!!"));