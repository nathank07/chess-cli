const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath)
const { moveUCI, FENtoBoard } = require('../game.js')

function verify(uci, id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT fen, uci FROM Games WHERE id = ?', id, function(err, row) {
            if(err) {
                reject(err)
            }
            if(!row) {
                reject("Could not find game")
            }
            const game = FENtoBoard(row.fen)
            if(row.uci === null) {
                resolve(moveUCI(game, uci))
                return 
            }
            const moves = row.uci.split(" ")
            moves.forEach(move => {
                if(move) {
                    moveUCI(game, move)
                } else {
                    reject("Game is invalid.")
                }
            });
            resolve(moveUCI(game, uci)) 
            return
        })
    })
}

function updateDB(uci, id) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Games SET uci = CASE WHEN uci IS NULL THEN ? ELSE uci || ? END WHERE id = ?', uci, ` ${uci}`, id, function(err) {
            if(err) {
                reject(err)
            }
            resolve(true)
        })
    })
}

module.exports.verify = verify;
module.exports.updateDB = updateDB;