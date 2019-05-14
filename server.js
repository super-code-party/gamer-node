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
app.use(express.static('public'));

//--------------------------------*
//
// Space left for methodOverride
//
//--------------------------------*

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
app.get('/pages/about');

app.get('/',loadGames);
app.post('/gameSearches/show', searchInInternetGameDatabase);

app.post('/detail', displayGameDetail);

app.get('/error', errorPage);




function VideoGame(info) {
  this.id = info.id;
  this.name = info.name;
  this.cover_url = urlCheck(info);
  this.summary = info.summary;
  this.platforms = checkPlatforms(info) || 'Platform not avialable!';
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

//VieW GAMES
// function getGames (request, response){
//   let SQL = `SELECT * FROM games WHERE id=$1;`;

//   let values = [request.params.id];

//   return client.query(SQL, values)
//   .then(results => {
//     response.render('/', {results: results.rows[0]});
//   })
//   .catch (err => errorPage(err, response));
// }

//LOAD GAMES

function loadGames (request, response) {
  let SQL = 'SELECT * FROM games;';

  return client.query(SQL) 
    .then (results => console.log({result: results.rows}))
    .then (results => response.render('views/index', {result: results.rows}))
    .catch (err => errorPage(err, response));


}

// // SAVE GAME FUNCTION
// function saveGames (request, response) {
//   let {name, cover_url, summary, genres, release_date} = request.body;

//   let SQL = 'INSERT INTO games (name, cover_url, summary, genres, release_date) VALUES ($1, $2, $3, $4, $5) RETURNING id;';

//   let values = [name, cover_url, summary, genres, release_date];

//   return client.query(SQL, values)
//   .then(results => response.redirect('/'))
//   .catch(err => errorPage(err, response));
// };

function searchInInternetGameDatabase(request, response) {
  // let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=${request.body.typeOfSearch}`;

  let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=category,name,platforms.name,cover.url,genres.name,first_release_date,url,summary`;

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
