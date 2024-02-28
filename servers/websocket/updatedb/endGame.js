const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)

function updateEnd(id, winner, reason) {
    return new Promise((resolve, reject) => {
        let flag;
        returnEnd(id)
            .then(() => {
                resolve(true)
                flag = true
            })
            .catch((err) => {
                if(err !== "Query returned undefined") {
                    reject(err)
                }
                flag = false
            })
        if(flag) { return }
        db.run("UPDATE game SET game_ended = ? WHERE id = ?", id, id, function(err) {
            if(err) {
                reject(err)
            }
        })
        db.run("INSERT INTO game_ended (id, winner, reason) VALUES (?, ?, ?)", id, winner, reason, function(err) {
            if(err) {
                reject(err)
            }
            resolve(true)
        })
    })
}

function returnEnd(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT game_ended FROM game WHERE id = ?", id, function(err, row) {
            if(err) {
                reject(err)
                return
            }
            if(row === undefined) {
                reject("Game does not exist")
                return
            }
            if(row.game_ended === null) {
                resolve(false)
                return
            }
        })
        db.get("SELECT winner, reason FROM game_ended WHERE id = ?", id, function(err, row) {
            if(err) {
                reject(err)
                return
            }
            if(row === undefined) {
                // reject("Query returned undefined")
                // This should be a reject but it will have intermitent errors
                // when loading so I'm just going to resolve false
                resolve(false)
                return
            }
            resolve({winner: row.winner, reason: row.reason})
        })
    })
}


function endGame(wss, id, outcome, reason) {
    console.log(`Ending game ${id} with result ${outcome} for reason ${reason}`)
    wss.clients.forEach((client) => {
        if (Number(client.gameId) === Number(id)) {
            client.send(JSON.stringify({ result: outcome, reason: reason }));
        }
    });
    updateEnd(id, outcome, reason)
        .catch(err => {
            console.log(err)
        })
    wss.timers[id].whiteTimer.timerFinishedFunction = () => {}
    wss.timers[id].whiteTimer.updateFunction = () => {}
    wss.timers[id].blackTimer.timerFinishedFunction = () => {}
    wss.timers[id].blackTimer.updateFunction = () => {}
    delete wss.timers[id]
}

module.exports.returnEnd = returnEnd;
module.exports.endGame = endGame;
module.exports.updateEnd = updateEnd;