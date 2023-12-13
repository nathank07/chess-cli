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

module.exports.insertPlayer = insertPlayer