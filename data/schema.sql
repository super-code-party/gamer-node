DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS games;


CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  cover_url TEXT, 
  summary TEXT,
  genres VARCHAR(100),
  release_date VARCHAR(100)
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

INSERT INTO games (name, cover_url, summary, genres, release_date)
VALUES ('Dance Dance Revolution', 'https://www.amazon.com/Dance-Revolution-Playstation/dp/B00005A774', 'dance the nite away baby ;)', 'party', 'Oct 5 1912');
