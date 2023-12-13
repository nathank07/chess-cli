const { createNewGame } = require("./updatedb/newGame.js")
const { verify, updateDB } = require('./updatedb/verify');
const { exportGame } = require('./updatedb/exportGame.js')
const { tokenToID } = require('./jwt.js')
const { insertPlayer } = require('./updatedb/players.js')

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', handleMessage);
    ws.on('close', handleClose);
});

function handleMessage(data) {
    const str = data.toString();
    try {
        const query = JSON.parse(str);
        const currentTokens = []
        let whitePlayer = {token: null, id: null}
        let blackPlayer = {token: null, id: null}
        if (query.token) {
            handleTokenQuery(query, currentTokens, whitePlayer, blackPlayer);
        }
        if (query.fen) {
            sendNewGame(query);
        }
        if (query.id && query.uci && query.token) {
            sendMove(query, whitePlayer, blackPlayer);
        }
        if (query.id && !query.uci) {
            sendExport(query);
        }
    } catch (e) {
        console.log("FAIL: ", JSON.parse(str))
        console.log(e)
    }
}

function handleTokenQuery(query, currentTokens, whitePlayer, blackPlayer) {
    if (!currentTokens.includes(query.token)) {
        tokenToID(query.token)
            .then(id => {
                insertPlayer(query.id, id)
                    .then(res => {
                        if (res === "white") {
                            whitePlayer.token = query.token
                            whitePlayer.id = id
                        } else if (res === "black") {
                            blackPlayer.token = query.token
                            blackPlayer.id = id
                        }
                        currentTokens.push(query.token)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }
}

function sendNewGame(query) {
    createNewGame(query.fen)
        .then(id => {
            ws.send(id);
        })
        .catch(err => {
            ws.send("Could not create game: ", err)
        })
}

function sendMove(query, whitePlayer, blackPlayer) {
    console.log(`Recieved ${query.uci} request to game ${query.id}`)
    let playerID = null
    if (query.token === whitePlayer.token || query.token === blackPlayer.token) {
        if (query.token === whitePlayer.token) {
            playerID = whitePlayer.id
        }
        if (query.token === blackPlayer.token) {
            playerID = blackPlayer.id
        }
    } else {
        return
    }
    verify(query.uci, query.id, playerID)
        .then(res => {
            const messages = []
            let clientCount = 0
            if (res) {
                updateDB(query.uci, query.id)
                    .then(() => {
                        messages.push(query.uci)
                        wss.clients.forEach((client) => {
                            if (client.gameId === query.id) {
                                clientCount++
                                client.send(JSON.stringify({ uci: query.uci }))
                                if (res.result) {
                                    if (messages.length === 1) { messages.push(res.result, res.reason) }
                                    client.send(JSON.stringify({ result: res.result, reason: res.reason }))
                                }
                            }
                        })
                        console.log(`Sent ${messages} to game ${query.id} (${clientCount} clients)`)
                    })
                    .catch((rej) => {
                        console.log("Database could not be updated", rej)
                        ws.send(rej)
                    })
            } else {
                console.log(`${query.uci} to ${query.id} was invalid, sending response`)
                wss.clients.forEach((client) => {
                    if (client.gameId === query.id) {
                        client.send(JSON.stringify({ invalid: true, uci: query.uci }))
                    }
                })
            }
        })
        .catch(rej => {
            console.log(rej)
        })
}

function sendExport(query) {
    exportGame(query.id)
        .then(res => {
            ws.gameId = query.id
            console.log(`Client of ${ws.gameId} has connected`)
            ws.send(JSON.stringify({ exportedGame: res, id: query.id }))
        })
        .catch(rej => {
            ws.send("Error: Could not find")
            console.log(rej)
        })
}

function handleClose() {
    console.log(`One client of ${ws.gameId} has disconnected`)
}

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
