const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath)
const { endGame, updateEnd } = require('./endGame.js')
const { ChessTimer } = require('../timer.js')
const { checkFlagDraw } = require('./verify.js')

function exportGame(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT fen, uci FROM game WHERE id = ?", id, function(err, row) {
            if(err) {
                reject(err)
                return
            }
            if(row === undefined) {
                reject("Game does not exist")
                return
            }
            if(row.uci === null) {
                resolve([row.fen])
                return
            }
            const moves = row.uci.split(' ')
            resolve([row.fen, moves])
        })
    })
}

function recoverTimers(wss) {
    return new Promise((resolve, reject) => {
        db.all("SELECT fen, id, timed_uci, time_control FROM game WHERE game_ended IS NULL", function(err, rows) {
            if(err) {
                reject(err)
                return
            }
            let timers = {}
            rows.forEach(async row => {
                if(row.timed_uci === null || row.timed_uci.split(' ').length < 2) {
                    await updateEnd(row.id, "draw", "Game timed out")
                    return
                }
                const whiteStart = row.fen.split(" ")[1] === "w"
                const timeControl = row.time_control.split('+')
                const timedUCI = row.timed_uci.split(' ')
                const whitesMoves = timedUCI.filter((_, i) => i % 2 === whiteStart ? 0 : 1)
                const blacksMoves = timedUCI.filter((_, i) => i % 2 === whiteStart ? 1 : 0)
                let whiteTime = Number(timeControl[0]) * 1000;
                let blackTime = Number(timeControl[0]) * 1000;
                whitesMoves.forEach(time => {
                    whiteTime -= Number(time)
                    whiteTime += Number(timeControl[1]) * 1000
                });
                blacksMoves.forEach(time => {
                    blackTime -= Number(time)
                    blackTime += Number(timeControl[1]) * 1000
                });
                const whiteTimer = ChessTimer(whiteTime / 1000, Number(timeControl[1]), false, () => flagPlayer(wss, row.id, true))
                const blackTimer = ChessTimer(blackTime / 1000, Number(timeControl[1]), false, () => flagPlayer(wss, row.id, false), whiteTimer)
                whiteTimer.linkedTimer = blackTimer
                if(whiteStart) {
                    timedUCI.length % 2 ? blackTimer.start() : whiteTimer.start()
                } else {
                    timedUCI.length % 2 ? whiteTimer.start() : blackTimer.start()
                }
                timers[Number(row.id)] = {
                    whiteTimer: whiteTimer,
                    blackTimer: blackTimer,
                    startClock: true,
                }
            })
            resolve(timers)
        })
    })
}

function flagPlayer(wss, id, isWhite) {
    console.log(`Flagged ${isWhite ? "white" : "black"} in game ${id}`)
    checkFlagDraw(id, isWhite)
        .then(draw => {
            if(draw) {
                console.log("Draw by flag")
                endGame(wss, id, "draw", "time")
            } else {
                console.log("Loss by flag")
                endGame(wss, id, isWhite ? "black" : "white", "time")
            }
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports.exportGame = exportGame
module.exports.recoverTimers = recoverTimers