CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fen TEXT NOT NULL,
    uci TEXT,
    whitePlayerID INTEGER,
    blackPlayerID INTEGER,
    game_ended_reason TEXT,
    game_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(whitePlayerID) REFERENCES user(id),
    FOREIGN KEY(blackPlayerID) REFERENCES user(id)  
);

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT UNIQUE,
    user_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);