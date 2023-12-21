CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fen TEXT NOT NULL,
    uci TEXT,
    whitePlayerID INTEGER,
    blackPlayerID INTEGER,
    game_ended INTEGER,
    time_control TEXT,
    game_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(game_ended) REFERENCES game_ended(id),
    FOREIGN KEY(whitePlayerID) REFERENCES user(id),
    FOREIGN KEY(blackPlayerID) REFERENCES user(id)  
);

CREATE TABLE game_ended (
    id INTEGER PRIMARY KEY,
    winnerID INTEGER,
    reason TEXT,
    FOREIGN KEY(winnerID) REFERENCES user(id)
);

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    user_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);