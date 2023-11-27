const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath)

function createNewGame(fen) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO Games (fen) VALUES (?)", fen, function(err) {
            if(err) {
                reject(err)
            }
            resolve(this.lastID)
        })
    })
}

module.exports.createNewGame = createNewGame;