const { ALPN_ENABLED } = require('constants');
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');


const Blog = require('./model/blog.js')
require('dotenv').config()

const port = process.env.PORT || 3000;

const app = express();

//server setup

app.set('view engine', 'ejs');

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {

        app.listen(port);
        console.log('server running at  ', port);

    })
    .catch(err => {
        console.log(err);
    })




// morgan
app.use(morgan('dev'));
//static
app.use(express.static('public'));
//url parse
app.use(express.urlencoded({ extended: true }));


//home page  // all blogs  ....................................


app.get('/', (req, res) => {


    Blog.find().sort({ createdAt: -1 })
        .then(result => {

            res.render('index', { title: 'Home', blogs: result });

        })
        .catch(err => console.log(err))


});


// single blog ................................................

app.get('/blog/:id', (req, res) => {


    const id = req.params.id;


    Blog.findById(id)
        .then(result => {
            console.log(result);

            res.render('blog', { title: 'Blog' ,blog:result});

        })
        .catch(err => console.log(err))


});

//single blog delete



app.delete('/blog/:id', (req, res) => {


    const id = req.params.id;

    const myresponse = {
        status:'sucess'
    }


    Blog.findByIdAndDelete(id)
        .then(result => {
        
           res.json(myresponse)
        })
        .catch(err => console.log(err))


});










// editor page.................................................


app.get('/editor', (req, res) => {


    Blog.find().sort({ createdAt: -1 })
        .then(result => {

            res.render('editor', { title: 'Editor', blogs: result });


        })
        .catch(err => console.log(err))




});


//create blog


app.get('/create', (req, res) => {

    res.render('create', { title: 'Create' });
});


app.post('/create', (req, res) => {

    const blog = new Blog(req.body);

    blog.save()
        .then(result => {
            res.redirect('/editor');
        })
        .catch(err => console.log(err));


});






//middleware

app.use((req, res) => {
    res.send('404 not found , oops!')
});




//   /blog/:id
