const sqlite3 = require('sqlite3').verbose()
const path = require('path');
const dbPath = path.resolve(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath)

function exportGame(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT fen, uci FROM Games WHERE id = ?", id, function(err, row) {
            if(err) {
                reject(err)
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

module.exports.exportGame = exportGame