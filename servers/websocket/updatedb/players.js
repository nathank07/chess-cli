const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)

function insertPlayer(gameID, playerID) {
    return new Promise((resolve, reject) => {
        db.get("SELECT whitePlayerID, blackPlayerID FROM game WHERE id = ?", gameID, (err, row) => {
            if(err) {
                console.log(err)
                reject(err)
            }
            if(row === undefined) {
                reject("Game does not exist")
            }
            if(row.whitePlayerID === null) {
                db.run("UPDATE game SET whitePlayerID = ? WHERE id = ?", playerID, gameID, (err) => {
                    if(err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("white")
                })
            } else if(row.blackPlayerID === null) {
                db.run("UPDATE game SET blackPlayerID = ? WHERE id = ?", playerID, gameID, (err) => {
                    if(err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve("black")
                })
            } else {
                resolve(false)
            }
        })       
    })
}

function returnPlayers(gameID) {
    return new Promise((resolve, reject) => {
        db.get("SELECT whitePlayerID, blackPlayerID FROM game WHERE id = ?", gameID, (err, row) => {
            if(err) {
                console.log(err)
                reject(err)
            }
            if(row === undefined) {
                reject("Game does not exist")
            }
            let whitePlayer = {id: null, token: null}
            let blackPlayer = {id: null, token: null}
            if(row.whitePlayerID) {
                whitePlayer.id = row.whitePlayerID
            }
            if(row.blackPlayerID) {
                blackPlayer.id = row.blackPlayerID
            }
            resolve({whitePlayer, blackPlayer})
        })
    })
}

module.exports.insertPlayer = insertPlayer
module.exports.returnPlayers = returnPlayers