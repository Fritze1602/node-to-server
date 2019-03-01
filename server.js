const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();


hbs.registerPartials( __dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());
   
app.set('view engine', 'hbs');


app.use((req,res,next) => {
    const now = new Date().toString();
    log = `${now}, ${req.method}, ${req.url}`;
    console.log(log);
    fs.appendFile('serverlog.txt', log + '\n', (err) => {
        if (err) console.log('unable to log');
    });
    next();
});

// app.use((req, res, next) => {
//    res.render('maintanance.hbs');
// });

app.use(express.static(__dirname + '/public'));

app.get('/',  (req, res) => {
        res.render('home.hbs',{
            title: 'Startpage',
            welcomeMsg: 'Hi there, this is my brand new Homepage',
        });
    }
);

app.get('/about', (req, res)=>{
    res.render('about.hbs', {
        title: 'About Page',
    });
});

app.get('/bad', (req, res)=> {
    res.send({
        errorMessage: 'Bad request'
    });
});

// Static Server

app.listen(3000, () => {
    console.log('Server is up on 3000');
});