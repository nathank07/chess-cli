const sqlite3 = require('sqlite3').verbose()
const { time } = require('console');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)

function createNewGame(fen, timeControl) {
    return new Promise((resolve, reject) => {
        timeControl = `${timeControl.seconds}+${timeControl.increment}`
        db.run("INSERT INTO game (fen, time_control) VALUES (?, ?)", fen, timeControl, function(err) {
            if(err) {
                console.log(err)
                reject(err)
            }
            resolve(Number(this.lastID))
        })
    })
}

module.exports.createNewGame = createNewGame;