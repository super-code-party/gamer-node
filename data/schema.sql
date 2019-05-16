DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  genres_id INT,
  FOREIGN KEY (genres_id) REFERENCES genres(id),
  release_date VARCHAR,
  summary VARCHAR,
  cover_url VARCHAR,
  platforms VARCHAR,
  rating VARCHAR,
  gameMode VARCHAR,
  company VARCHAR,
  isPlayed BOOLEAN
);




INSERT INTO genres (name) SELECT 'RPG' WHERE NOT EXISTS (SELECT name FROM genres WHERE name = 'RPG');

INSERT INTO games (name, genres_id, release_date, summary, cover_url, platforms, rating, gameMode, company, isPlayed) VALUES ('Mario and Luigi Paper Jam', (SELECT genres.id FROM genres WHERE genres.name='RPG'), 'Oct 5 1991', 'Paper Jamming', 'https://images.igdb.com/igdb/image/upload/t_thumb/idketxgjzfznumiooigw.jpg', 'ps4', '88', 'Offline', 'Nintendo', 'False');

-- Must run first
-- INSERT INTO genres (name) SELECT 'FPS' WHERE NOT EXISTS (SELECT name FROM genres WHERE name = 'FPS');

-- Then run this
-- INSERT INTO games (name, genres_id, release_date, summary, cover_url) VALUES ('sql', (SELECT genres.id FROM genres WHERE genres.name='FPS'), 'today', 'it is very hard', 'picture');

-- (INSERT INTO genres (name) SELECT 'FPS' WHERE NOT EXISTS (SELECT name FROM genres WHERE name = 'FPS')) INSERT INTO games (name, genres_id, release_date, summary, cover_url) VALUES ('sql', (SELECT genres.id FROM genres WHERE genres.name='FPS'), 'today', 'it is very hard', 'picture');
-- INSERT INTO genres (name) SELECT '${genres}' WHERE NOT EXISTS (SELECT name FROM genres WHERE name = '${genres}'); INSERT INTO games (name, genres_id, release_date, summary, cover_url) VALUES ('sql', (SELECT genres.id FROM genres WHERE genres.name='${genres}'), 'today', 'it is very hard', 'picture');
