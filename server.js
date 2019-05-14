'use strict';

// Application Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');

// Environment Variable
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// For rendering
app.set('view engine', 'ejs');


// app.get('/');


app.get('/', (request, response) => {
  response.render('index');
});



app.listen(PORT, () => console.log(`Listening on ${PORT}`));
