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

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// For Server Side Rendering
app.set('view engine', 'ejs');


// Routes

app.get('/', getGames);
app.post('/gameSearches/show', searchInInternetGameDatabase);
app.post('/games/detail', addGame);
app.put('/games/:gameId', updateGame);
app.get('/games/:gameId', getGameDetails);
app.delete('/games/:gameId', deleteGame);


app.get('/error', errorPage);

app.get('/about', aboutUsPage);



function VideoGame(info) {
  this.id = info.id;
  this.name = info.name;
  this.cover_url = urlCheck(info);
  this.summary = info.summary;
  this.platforms = checkPlatforms(info) || 'Platform not avialable!';
  this.category = info.category;
  this.genres = genreCheck(info) || 'Genre unavailable';
  this.release_date = epochConvert(info.first_release_date);
}

//Converts image url from //url to https://url
const urlCheck = (info) => {
  let image = 'http://1.bp.blogspot.com/-Dz_l-JwZRX8/U1bcqpZ86oI/AAAAAAAAACs/VUouedmQHic/s1600/skyrim_arrow_knee_g_display.jpg';
  if (info.cover === undefined || info.cover === null) {
    return image;
  }else if(!info.cover.url.includes('https://')) {
    let newData = info.cover.url.replace('/', 'https:/');
    return newData;
  }
};

//Converts release date from EPOCH to normal time
const epochConvert = (time) => {
  let date = new Date(time *1000).toString().slice(4, 15);
  return date;
};

//Checks if genres exists and has safeguard for ones that don't
const genreCheck = (info) => {
  if(info.genres === undefined || info.genres === null){
    return false;
  }else{
    return info.genres[0].name;
  }
};

//checks platform yeah
const checkPlatforms = (info) => {
  if(info.platforms === undefined || info.platforms === null){
    return false;
  }else{
    return info.platforms.map( (plats) => {
      return plats.name;
    });
  }
};


function searchInInternetGameDatabase(request, response) {
  let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=category,name,platforms.name,cover.url,genres.name,first_release_date,url,summary`;

  superagent.post(url)
    .set('user-key', process.env.IGDB_API_KEY)
    .set('Accept', 'application/json')
    .then(response => response.body.map(apiResult => new VideoGame(apiResult)))
    .then(videoGames => response.render('pages/gamesSearches/show', {listOfVideoGames: videoGames}))
    .catch(console.error);
}


function getGames(request, response) {
  let SQL = 'SELECT * FROM games;';

  return client.query(SQL)
    .then(result => {
      response.render('index', {results: result.rows});
    })
    .catch(console.error);
}


function addGame(request, response) {
  let {name, genres, release_date, summary, cover_url} = request.body;

  let SQL = 'INSERT INTO games(name, genres, release_date, summary, cover_url) VALUES ($1, $2, $3, $4, $5) RETURNING id;';

  let values = [name, genres, release_date, summary, cover_url];

  return client.query(SQL, values)
    .then(result => {
      response.redirect(`/games/${result.rows[0].id}`);
    })
    .catch(console.error);
}


function getGameDetails(request, response) {
  let SQL = 'SELECT * FROM games WHERE id=$1;';
  let values = [request.params.gameId];
  return client.query(SQL, values)
    .then(result => {
      response.render('pages/gamesSearches/detail', {result: result.rows[0]});
    })
    .catch(err => {
      console.error(err);
      errorPage(err, response);
    });
}


// Updating but acting strange
function updateGame(request, response){
  let {name, genres, release_date, summary, cover_url} = request.body;
  let SQL = 'UPDATE games SET name=$1, genres=$2, release_date=$3, summary=$4, cover_url=$5 WHERE id=$6;';
  let values = [name, genres, release_date, summary, cover_url, request.params.gameId];

  client.query(SQL, values)
    .then(response.redirect(`/games/${request.params.gameId}`))
    .catch(console.error);
}



function deleteGame(request, response){
  let SQL = 'DELETE FROM games WHERE id=$1;';
  let values = [request.params.gameId];


  client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(console.error);
}


// error
function errorPage(error, response){
  response.render('pages/error', {error: 'There was an issue. Stop breaking things!'});
}

function aboutUsPage(request, response){
  response.render('pages/about', {about: 'Welcome to our page'});
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
