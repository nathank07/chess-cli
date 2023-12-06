const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)

function createNewGame(fen) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO game (fen) VALUES (?)", fen, function(err) {
            if(err) {
                console.log(err)
                reject(err)
            }
            resolve(this.lastID)
        })
    })
}

module.exports.createNewGame = createNewGame;