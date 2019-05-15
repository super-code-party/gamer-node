-- DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS games;


CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  genres VARCHAR,
  release_date VARCHAR,
  summary VARCHAR,
  cover_url VARCHAR
  -- platforms VARCHAR(255),
  -- company VARCHAR(255),
  -- isPlayed BOOLEAN,
  -- multiplayer BOOLEAN,
  -- esrb INT,
  -- gameshelves VARCHAR(255),
  -- igdb_id INT,
);

-- CREATE TABLE publishers (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255),
--   games_id INTEGER NOT NULL,
--   FOREIGN KEY (games_id) REFERENCES games (id),
-- );

INSERT INTO games (name, genres, release_date, summary, cover_url)
VALUES ('Mario and Luigi Paper Jame', 'RPG', 'Oct 5 1991', 'Paper Jamming', 'https://images.igdb.com/igdb/image/upload/t_thumb/idketxgjzfznumiooigw.jpg');
