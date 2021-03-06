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
  this.id = info.id;      // Not using but might need for Stretch Goals
  this.name = info.name;
  this.cover_url = urlCheck(info);
  this.summary = info.summary;

  this.platforms = checkPlatforms(info) || 'Platform not available!';
  this.genres = genreCheck(info) || 'Genre not available';
  this.release_date = epochConvert(info.first_release_date);
  this.rating = parseInt(info.rating) || 'Rating not available';
  this.game_mode = gameModeCheck(info) || 'Game mode not available';
  this.company = companyCheck(info) || 'Company not available';
  this.is_played = false;
}

//Converts image url from //url to https://url
const urlCheck = (info) => {
  let image = 'http://1.bp.blogspot.com/-Dz_l-JwZRX8/U1bcqpZ86oI/AAAAAAAAACs/VUouedmQHic/s1600/skyrim_arrow_knee_g_display.jpg';
  if (info.cover === undefined || info.cover === null) {
    return image;
  }else{
    (!info.cover.url.includes('https://'));
    let newData = info.cover.url.replace('/', 'https:/');
    return newData;
  }
};

//Converts release date from EPOCH to normal time
const epochConvert = (time) => {
  let noDate = 'TBA';
  if(time === undefined || time === null){
    return noDate;
  }else{
    let date = new Date(time *1000).toString().slice(4, 15);
    return date;
  }
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


//Checks if game mode exists and has safeguard for ones that don't
const gameModeCheck = (info) => {
  if(info.game_modes === undefined || info.game_modes === null){
    return false;
  }else{
    return info.game_modes.map( (modes) => {
      return modes.name;
    });
  }
};

//Checks if company exists and has safeguard for ones that don't
const companyCheck = (info) => {
  if(info.involved_companies){
    return info.involved_companies.map(() => {
      return info.involved_companies[0].company.name;
    });
  }else{
    return false;
  }
};

function searchInInternetGameDatabase(request, response) {
  let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=category,name,platforms.name,cover.url,genres.name,first_release_date,url,summary,rating,game_modes.name,involved_companies.company.name`;

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
  let {name, genres, release_date, summary, cover_url, platforms, rating, game_mode, company, is_played} = request.body;
 

  let SQL = 'INSERT INTO genres (name) SELECT $1 WHERE NOT EXISTS (SELECT name FROM genres WHERE name = $2);';
  let values = [genres, genres];


  return client.query(SQL, values)
    .then( () => {
      let subQuery = '(SELECT genres.id FROM genres WHERE genres.name=$2)';
      let SQLinner = `INSERT INTO games (name, genres_id, release_date, summary, cover_url, platforms, rating, game_mode, company, is_played) VALUES ($1, ${subQuery}, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id;`;
      if(is_played === undefined) is_played = false;
      console.log('In addGame Function', is_played);

      let valuesInner = [name, genres, release_date, summary, cover_url, platforms, rating, game_mode, company, is_played];


      return client.query(SQLinner, valuesInner)
        .then(result => {
          response.redirect(`/games/${result.rows[0].id}`);
        });
    })
    .catch(err => {
      console.error(err);
      errorPage(err, response);
    });

}


function getGameDetails(request, response) {
  let SQL = 'SELECT games.name, games.id, genres.name AS genres, release_date, summary, cover_url, platforms, rating, game_mode, company, is_played  FROM games,genres WHERE games.genres_id=genres.id AND games.id=$1;';
  let values = [request.params.gameId];

  return client.query(SQL, values)
    .then(result => {
      response.render('pages/gamesSearches/detail',{result: result.rows[0]});
    })
    .catch(err => {
      // console.error(err);
      errorPage(err, response);
    });
}


// Updating but acting strange
function updateGame(request, response){
  let { name, genres, release_date, summary, cover_url, platforms, rating, game_mode, company, is_played } = request.body;


  let SQL = 'INSERT INTO genres (name) SELECT $1 WHERE NOT EXISTS (SELECT name FROM genres WHERE name = $2);';
  let values = [genres, genres];

  return client.query(SQL, values)
    .then( () => {
      let subQuery = '(SELECT genres.id FROM genres WHERE genres.name=$2)';
      let SQLinner = `UPDATE games SET name=$1, genres_id=${subQuery}, release_date=$3, summary=$4, cover_url=$5, platforms=$6, rating=$7, game_mode=$8, company=$9, is_played=$10 WHERE id=$11;`;
      if(is_played === undefined) is_played = false;
      let valuesinner = [name, genres, release_date, summary, cover_url, platforms, rating, game_mode, company, is_played, request.params.gameId];


      return client.query(SQLinner, valuesinner)
        .then(response.redirect(`/games/${request.params.gameId}`))
        .catch(console.error);
    })
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
  // response.render('pages/error', {error: 'There was an issue. Stop breaking things!'});
  response.render('pages/error', {error: error});

}

function aboutUsPage(request, response){
  response.render('pages/about', {about: 'Say Hello to Our Dev Team!'});
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
