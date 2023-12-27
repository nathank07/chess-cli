const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)

function insertPlayer(gameID, playerID, joiningAsBlack) {
    return new Promise((resolve, reject) => {
        db.get("SELECT whitePlayerID, blackPlayerID FROM game WHERE id = ?", gameID, (err, row) => {
            if(err) {
                console.log(err)
                reject(err)
            }
            if(row === undefined) {
                reject("Game does not exist")
            }
            if(row.whitePlayerID === playerID) {
                resolve("white")
                return
            }
            if(row.blackPlayerID === playerID) {
                resolve("black")
                return
            }
            if(!joiningAsBlack && row.whitePlayerID === null) {
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
        db.get("SELECT whitePlayerID, blackPlayerID FROM game WHERE id = ?", gameID, async (err, row) => {
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
                try {
                    whitePlayer.username = await idToUsername(row.whitePlayerID)
                }
                catch {
                    reject("User does not exist")
                }
            }
            if(row.blackPlayerID) {
                blackPlayer.id = row.blackPlayerID
                try {
                    blackPlayer.username = await idToUsername(row.blackPlayerID)
                }
                catch {
                    reject("User does not exist")
                }
            }
            resolve({whitePlayer, blackPlayer})
        })
    })
}

function idToUsername(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT username FROM user WHERE id = ?", id, (err, row) => {
            if(err) {
                console.log(err)
                reject(err)
            }
            if(row === undefined) {
                reject("User does not exist")
                return
            }
            resolve(row.username)
        })
    })

}

module.exports.insertPlayer = insertPlayer
module.exports.returnPlayers = returnPlayers