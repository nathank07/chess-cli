const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)
const { moveUCI, FENtoBoard } = require('../game.js')

function verify(uci, id, playerID) {
    return new Promise((resolve, reject) => {
        db.get('SELECT fen, uci, whitePlayerID, blackPlayerID FROM game WHERE id = ?', id, function(err, row) {
            whitePlayerID = Number(row.whitePlayerID)
            blackPlayerID = Number(row.blackPlayerID)
            if(whitePlayerID !== playerID && blackPlayerID !== playerID) {
                reject("You are not a player in this game.")
            }
            if(err) {
                reject(err)
            }
            if(!row) {
                reject("Could not find game")
            }
            const game = FENtoBoard(row.fen)
            if(row.uci === null) {
                if(game.whitesMove && whitePlayerID !== playerID) {
                    reject("It is not your turn.")
                }
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
            if(game.whitesMove && whitePlayerID !== playerID) {
                reject("It is not your turn.")
            }
            resolve(moveUCI(game, uci)) 
            return
        })
    })
}

function updateDB(uci, id) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE game SET uci = CASE WHEN uci IS NULL THEN ? ELSE uci || ? END WHERE id = ?', uci, ` ${uci}`, id, function(err) {
            if(err) {
                reject(err)
            }
            resolve(true)
        })
    })
}

module.exports.verify = verify;
module.exports.updateDB = updateDB;