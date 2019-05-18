# Gamer-node
https://gamer-node.herokuapp.com

# Super Code Party
Edric DeArment\
Matt Wilkin\
Felipe Delatorre\
Tia Rose

# Description
This app allows users to search for for video games and add them to their list.


# Problem Domain
It can be hard for a user to to keep track of games they have played or would like to played. Our group wanted to create an app where users can store critical info of the games they have played and the games that they want to play.

# Semantic versioning
Version 1.0.0 - Gathering information from the IGDB API

Version 1.0.1 - Rendering information on webpage

Version 1.0.2 - Saving information in database

Version 1.0.3 - Pull saved information from database

Version 1.0.4 - Update information already stored in database

Version 1.0.5 - Delete information already stored in database

Deployed Version: https://gamer-node.herokuapp.com/ \
Deployed Version: https://gamer-node-2.herokuapp.com/ \
Final Deployed Version: https://gamer-nodez.herokuapp.com/

# Technologies Used
Express\
Dotenv\
Superagent\
Pg\
MethodOverride\
JQuery\
EJS


# Instructions
npm install

View sample-env file for more instructions

# API EndPoints
Fields - example result

name - Super Mario Galaxy

platforms.name - RGP
cover.url - "//images.igdb.com/igdb/image/upload/t_thumb/dn7i6gqay5c0z0ntuhol.jpg"

genres.name - Platform

first_release_date - 1193875200 => Oct 31 2007

summary - Experience a gravity-defying adventure! Become Mario as he traverses gravity-bending galaxies...

rating - 87.9259971305794

game_modes.name - Single player

involved_companies.company.name - Nintendo

# Database schemas
DROP TABLE IF EXISTS games; \
DROP TABLE IF EXISTS genres;

CREATE TABLE genres ( \
  id SERIAL PRIMARY KEY, \
  name VARCHAR \
);

CREATE TABLE games ( \
  id SERIAL PRIMARY KEY, \
  name VARCHAR, \
  genres_id INT, \
  FOREIGN KEY (genres_id) REFERENCES genres(id), \
  release_date VARCHAR, \
  summary VARCHAR, \
  cover_url VARCHAR, \
  platforms VARCHAR, \
  rating VARCHAR, \
  game_mode VARCHAR, \
  company VARCHAR, \
  is_played BOOLEAN \
);
