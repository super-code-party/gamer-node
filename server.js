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


//
// Space left for methodOverride
//

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// For Server Side Rendering
app.set('view engine', 'ejs');


// Routes
app.get('/', (request, response) => {
  response.render('index');
});

app.post('/gameSearches/show', searchInInternetGameDatabase);

app.post('/detail', displayGameDetail);

app.get('/error', errorPage);
// Functions

function VideoGame(info) {
  this.id = info.id;
  this.name = info.name;
  // this.cover_url = info.cover.url;
  this.summary = info.summary;
  // this.platforms = info.platforms.name;
  this.category = info.category;
  // this.genres = info.genres.name;
  this.release_date = info.first_release_date;
}


function searchInInternetGameDatabase(request, response) {

  let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=category,name,platforms.name,cover.url,genres.name,first_release_date,url,summary`;

  //category,name,platforms.name,cover.url,genres.name,first_release_date

  superagent.post(url)
    .set('user-key', process.env.IGDB_API_KEY)
    .set('Accept', 'application/json')
    .then(response => response.body.map(apiResult => new VideoGame(apiResult)))
    .then(videoGames => response.render('pages/gamesSearches/show', {listOfVideoGames: videoGames}))
    .catch(console.error);

}

function displayGameDetail(request, response){
  let values = [request.params.game_id];
  console.log('values in displayGameDetail', values);

  response.redirect('gameSearches/detail');
  

}


// error
function errorPage(error, response){
  response.render('pages/error', {error: 'There was an issue. Stop breaking things!'});
}




app.listen(PORT, () => console.log(`Listening on ${PORT}`));
