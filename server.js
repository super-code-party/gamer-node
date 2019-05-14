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



function VideoGame(info) {
  console.log('from constructor');
  this.id = info.id;
  console.log(info);
  this.name = info.name;

  // let image = urlCheck(info.cover.url);
  
  // let image = 'http://1.bp.blogspot.com/-Dz_l-JwZRX8/U1bcqpZ86oI/AAAAAAAAACs/VUouedmQHic/s1600/skyrim_arrow_knee_g_display.jpg';
  
  this.cover_url = urlCheck(info);

  this.summary = info.summary;
  // this.platforms = info.platforms.name;
  this.category = info.category;
  // this.genres = info.genres.name;
  this.release_date = epochConvert(info.first_release_date);

  // console.log(info.summary);
}


//Converts image url from //url to https://url
const urlCheck = (info) => {
  let image = 'http://1.bp.blogspot.com/-Dz_l-JwZRX8/U1bcqpZ86oI/AAAAAAAAACs/VUouedmQHic/s1600/skyrim_arrow_knee_g_display.jpg';
  console.log(info.cover);
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




function searchInInternetGameDatabase(request, response) {
  // let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=${request.body.typeOfSearch}`;

  let url = `https://api-v3.igdb.com/games/?search=${request.body.name}&fields=category,name,platforms.name,cover.url,genres.name,first_release_date,url,summary`;
  console.log(request.body.name);
  console.log(request.body);
  console.log(request.body.typeOfSearch);
  console.log('Hello!!');
  console.log(request.body);

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
