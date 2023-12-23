const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)
const { moveUCI, FENtoBoard } = require('../game.js')

function verify(uci, id, playerIsWhite) {
    return new Promise((resolve, reject) => {
        db.get('SELECT fen, uci FROM game WHERE id = ?', id, function(err, row) {
            if(playerIsWhite === null || playerIsWhite === undefined) {
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
                if(game.whitesMove !== playerIsWhite) {
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
            if(game.whitesMove !== playerIsWhite) {
                reject("It is not your turn.")
            }
            resolve(moveUCI(game, uci)) 
            return
        })
    })
}

function startClock(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT uci FROM game WHERE id = ?', id, function(err, row) {
            if(err) {
                reject(err)
            }
            if(!row) {
                reject("Could not find game")
            }
            if(row.uci === null) {
                resolve(false)
                return 
            }
            console.log(row.uci.length)
            resolve(row.uci, row.uci.length > 6) 
            return
        })
    })
}

function checkFlagDraw(id, isWhiteFlagged) {
    return new Promise((resolve, reject) => {
        db.get('SELECT fen, uci FROM game WHERE id = ?', id, function(err, row) {
            if(err) {
                reject(err)
            }
            if(!row) {
                reject("Could not find game")
            }
            const game = FENtoBoard(row.fen)
            if(row.uci === null) {
                resolve(!matingMaterial(game, !isWhiteFlagged))
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
            resolve(!matingMaterial(game, !isWhiteFlagged)) 
            return
        })
    })
}

function matingMaterial(game, white) {
    let minorPieces = 0;
    let majorPieces = 0;
    game.board.forEach((row) => {
        row.forEach((piece) => {
            if(piece && piece.isWhite === white && piece.name !== "king") {
                minorPieces++
            }
            if(piece && piece.isWhite === white) {
                if(piece.name === "queen" || piece.name === "rook" || piece.name === "pawn") {
                    majorPieces++
                }
            }
        })
    })
    console.log(minorPieces, majorPieces)
    return minorPieces >= 2 || majorPieces >= 1
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

function updateTime(timeTaken, id) {
    return new Promise((resolve, reject) => {
        if(!timeTaken && timeTaken !== 0) {
            resolve(true)
            return
        }
        db.run('UPDATE game SET timed_uci = CASE WHEN timed_uci IS NULL THEN ? ELSE timed_uci || ? END WHERE id = ?', timeTaken, ` ${timeTaken}`, id, function(err) {
            if(err) {
                reject(err)
            }
            resolve(true)
        })
    })

}

module.exports.verify = verify;
module.exports.startClock = startClock;
module.exports.checkFlagDraw = checkFlagDraw;
module.exports.updateDB = updateDB;
module.exports.updateTime = updateTime;