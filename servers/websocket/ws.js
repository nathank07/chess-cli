const { createNewGame } = require("./updatedb/newGame.js")
const { returnEnd, endGame } = require("./updatedb/endGame.js")
const { verify, checkFlagDraw, startClock, updateDB, updateTime } = require('./updatedb/verify');
const { exportGame, recoverTimers } = require('./updatedb/exportGame.js')
const { tokenToID } = require('./jwt.js')
const { insertPlayer, returnPlayers } = require('./updatedb/players.js')
const { ChessTimer } = require('./timer.js')

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
});

let wss;

loadWebsocket()
    .then(res => {
        wss = res
    })
    .catch(err => {
        console.log(err)
    })

async function loadWebsocket() {
    console.log("Loading websocket")
    let wss = new WebSocket.Server({ server });
    wss.on('connection', async ws => {
        ws.userToken = null;
        ws.on('message', (e) => handleMessage(ws, e));
        ws.on('close', (e) => handleClose(ws, e));
        
    });
    try {
        const timers = await recoverTimers(wss)
        console.log("Recovered timers:", timers)
        wss.timers = timers
    }
    catch (e) {
        console.log("Failed to recover timers:", e)
    }
    return wss
}

async function handleMessage(ws, data) {
    const str = data.toString();
    try {
        const query = JSON.parse(str);
        console.log(query)
        if(query.id && query.token && !query.uci) {
            joinGame(ws, query);
        }
        if(query.fen) {
            sendNewGame(ws, query);
        }
        if(query.id && query.uci && query.token) {
            sendMove(ws, query);
        }
        if(query.id && query.uci && !query.token) {
            ws.send(JSON.stringify({ invalid: true, uci: query.uci }))
        }
        if(query.id && !query.uci && !ws.gameId) {
            sendExport(ws, query);
        }
    } catch (e) {
        console.log("FAIL: ", JSON.parse(str))
        console.log(e)
    }
}

async function joinGame(ws, query) {
    try {
        const id = await tokenToID(query.token)
        const color = await insertPlayer(query.id, id, query.joinAsBlack)
        if (color === "white") {
            ws.send(JSON.stringify({ isWhite: true }))
        } else if (color === "black") {
            ws.send(JSON.stringify({ isWhite: false }))
        } else if (color === false) {
            ws.send(JSON.stringify({ isWhite: null }))
        }  
        ws.userToken = query.token
        setPlayerSide(ws, query)  
    } catch (e) {
        ws.send(JSON.stringify({ isWhite: null }))
        console.log("Could not join game:", e)
    }
}

function sendNewGame(ws, query) {
    createNewGame(query.fen, query.timeControl)
        .then(id => {
            if(query.timeControl.seconds <= 15) {
                query.timeControl.seconds = 15
            }
            if(query.timeControl.seconds >= 3600) {
                query.timeControl.seconds = 3600
            }
            if(query.timeControl.increment <= 0) {
                query.timeControl.increment = 0
            }
            if(query.timeControl.increment >= 10) {
                query.timeControl.increment = 10
            }
            wss.timers = wss.timers || {}
            const whiteTimer = ChessTimer(query.timeControl.seconds, query.timeControl.increment, false, () => flagPlayer(id, true))
            const blackTimer = ChessTimer(query.timeControl.seconds, query.timeControl.increment, false, () => flagPlayer(id, false), whiteTimer)
            whiteTimer.linkedTimer = blackTimer
            wss.timers[id] = {
                whiteTimer: whiteTimer,
                blackTimer: blackTimer,
                startClock: false,
            }
            ws.send(id);
        })
        .catch(err => {
            ws.send("Could not create game: ", err)
        })
}

async function sendMove(ws, query) {
    console.log(`Recieved ${query.uci} request to game ${query.id}`)
    const inGame = ws.playerIsWhite !== undefined || await setPlayerSide(ws, query)
    if(!inGame) {
        console.log("canceled move")
        ws.send(JSON.stringify({ invalid: true, uci: query.uci }))
        return
    }
    verify(query.uci, query.id, ws.playerIsWhite)
        .then(async res => {
            const messages = [];
            let clientCount = 0;
            await updateDB(query.uci, query.id);
            const timeTaken = changeClock(query.id, !ws.playerIsWhite)
            await updateTime(timeTaken, query.id)
            messages.push(query.uci, timeTaken);
            const update = returnUpdateClock(query.id)
            let end = false
            wss.clients.forEach((client) => {
                if (client.gameId === query.id) {
                    clientCount++;
                    client.send(JSON.stringify({ uci: query.uci, update, timeTaken: timeTaken }));
                    if (res.result) {
                        if (messages.length === 1) { messages.push(res.result, res.reason) }
                        end = true
                    }
                }
            });
            if(end) {
                endGame(wss, query.id, res.result, res.reason)
            }
            console.log(`Sent ${messages} to game ${query.id} (${clientCount} clients)`);
        })
        .catch(err => {
            console.log(`${query.uci} to ${query.id} was invalid, sending response`);
            console.log(ws.playerIsWhite)
            console.log(err)
            wss.clients.forEach((client) => {
                if (client.gameId === query.id) {
                    client.send(JSON.stringify({ invalid: true, uci: query.uci }));
                }
            });
        })
}

async function sendExport(ws, query) {
    try {
        const res = await exportGame(query.id)
        const end = await returnEnd(query.id)
        ws.gameId = query.id
        console.log(`Client of ${ws.gameId} has connected`)
        ws.send(JSON.stringify({ exportedGame: res, id: query.id }))
        if(query.token) {
            setPlayerSide(ws, query)
        } else {
            const { whitePlayer, blackPlayer } = await returnPlayers(query.id)
            sendParticipants(query, whitePlayer.username, blackPlayer.username)
            sendClock(query.id, ws)
        }
        if(end) {
            ws.send(JSON.stringify({ result: end.winner, reason: end.reason }))
        }
    }
    catch(e) {
        console.log(e)
    }
}

async function setPlayerSide(ws, query) {
    try {
        const id = await tokenToID(ws.userToken)
        const { whitePlayer, blackPlayer } = await returnPlayers(query.id)
        if(id && whitePlayer.id === id || blackPlayer.id === id) {
            ws.playerIsWhite = whitePlayer.id === id
        }
        sendParticipants(query, whitePlayer.username, blackPlayer.username)
        return true
    }
    catch(e) {
        console.log(e)
        return false
    }
}

function sendParticipants(query, whitePlayerUsername, blackPlayerUsername) {
    if(!whitePlayerUsername && !blackPlayerUsername) {
        return
    }
    wss.clients.forEach((client) => {
        if (client.gameId === query.id) {
            if(whitePlayerUsername && blackPlayerUsername) {
                client.send(JSON.stringify({ whiteUser: whitePlayerUsername, blackUser: blackPlayerUsername }))
            } else {
                const obj = whitePlayerUsername ? { whiteUser: whitePlayerUsername } : { blackUser: blackPlayerUsername }
                client.send(JSON.stringify(obj))
            }
        }
    });
}

function sendClock(id, ws) {
    if(wss.timers && wss.timers[id]) {
        const timersPending = !wss.timers[id].whiteTimer.isRunning && !wss.timers[id].blackTimer.isRunning
        const activeClock = timersPending ? false : wss.timers[id].whiteTimer.isRunning ? "white" : "black"
        ws.send(JSON.stringify({
            increment: wss.timers[id].whiteTimer.increment / 1000, 
            whiteClock: wss.timers[id].whiteTimer.currentTime() / 1000,
            blackClock: wss.timers[id].blackTimer.currentTime() / 1000,
            activeClock: activeClock,
        }))
    } else {
        console.log("Could not find timer for game", id)
    }
}

function changeClock(id, isWhite) {
    let message;
    if(!wss.timers || !wss.timers[id]) {
        console.log("Did not find timer for game", id)
        return
    }
    const white = wss.timers[id].whiteTimer
    const black = wss.timers[id].blackTimer
    if(!wss.timers[id].startClock) {
        startClock(id).then(res => { wss.timers[id].startClock = res })
    }
    if(wss.timers[id].startClock) {
        if(!white.isRunning && !black.isRunning) {
            if(isWhite) {
                white.start()
                message = { startClock: "white" }
                console.log("white started")
            } else {
                black.start()
                message = { startClock: "black" }
                console.log("black started")
            }
        }
        else {
            // Could be either white or black, doesn't matter since they are linked
            white.alternate()
            message = { startClock: white.isRunning ? "white" : "black",
                        stopClock: white.isRunning ? "black" : "white" }
            console.log("White Black", white.isRunning, black.isRunning)
        }
    }
    if(message) {
        wss.clients.forEach((client) => {
            if(client.gameId === id) {
                console.log("sending clock message")
                client.send(JSON.stringify(message));
            }
        })
        if(message.stopClock) {
            return white.isRunning ? black.timeTaken : white.timeTaken
        }
    }
    return 0
}

function returnUpdateClock(id) {
    if(wss.timers && wss.timers[id]) {
        if(wss.timers[id].whiteTimer.isRunning) {
            return { whiteClock: {
                length: wss.timers[id].whiteTimer.length,
                timerStarted: wss.timers[id].whiteTimer.timerStarted,
            }}
        }
        if(wss.timers[id].blackTimer.isRunning) {
            return { blackClock: {
                length: wss.timers[id].blackTimer.length,
                timerStarted: wss.timers[id].blackTimer.timerStarted,
            }}
        }
    }
}

function flagPlayer(id, isWhite) {
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

function handleClose(ws) {
    console.log(`One client of ${ws.gameId} has disconnected`)
}

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
