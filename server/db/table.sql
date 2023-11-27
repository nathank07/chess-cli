CREATE TABLE Games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fen VARCHAR(100) NOT NULL,
    uci TEXT,
    player1id INT,
    player2id INT
);