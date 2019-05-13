DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS games;


CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  company VARCHAR(255),
  platforms VARCHAR(255),
  description TEXT,
  isPlayed BOOLEAN,
  multiplayer BOOLEAN,
  esrb INT,
  gameshelves VARCHAR(255),
  igdb_id INT,
  
);

CREATE TABLE publishers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  games_id INTEGER NOT NULL,
  FOREIGN KEY (games_id) REFERENCES games (id),
);