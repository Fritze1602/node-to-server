const express = require('express');
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');

const weather = require('./utilities/weather');

const port = process.env.PORT || 3000;
const app = express();

// Pathes for express configuration
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join( __dirname,  'templates/views');
const partialsPath = path.join( __dirname,  'templates/partials');

// Setup Handlebars engine and views location
hbs.registerPartials(partialsPath);
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.set('views', viewsPath);
app.set('view engine', 'hbs');

app.use((req,res,next) => {
    const now = new Date().toString();
    log = `${now}, ${req.method}, ${req.url}`;
    fs.appendFile('serverlog.txt', log + '\n', (err) => {
        if (err) console.log('unable to log');
    });
    next();
});

app.use(express.static(publicDirectoryPath));

app.get('/',  (req, res) => {
        res.render('index.hbs',{
            title: 'Weather',
            welcomeMsg: 'Das Wetter in ...',
        });
    }
);

app.get('/help', (req,res) => {
    res.render('help.hbs', {
        title: 'Help Page',
        msg: 'Welcome to our help and documentation Page'
    });
});

app.get('/about', (req, res)=>{
    res.render('about.hbs', {
        title: 'About Page',
        aboutText: 'created exactly-webdesign.com'
    });
});

//JSON Endpoint

app.get('/weather', (req, res)=> {
    if(!req.query.address){
        return res.send({
            error: 'Address required!!!'
        });
    }
    weather.getWeatherData(req.query.address).then((result)=>{
       res.send(result)
    }).catch((e) => {
       console.log(e)
        res.send({
            error: e
        });
    });
});


//404s
app.get('/help/*', (req, res)=>{
    res.render('my404.hbs', {
        title: '404 Page',
        msg404: 'Diese Hilfeseite wurde noch nicht erstellt.'
    });
});

app.get('*', (req, res)=> {
    res.render('my404.hbs', {
        title: '404 Page',
        msg404: 'File not found'
    });
});


// Static Server

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});

// Test


