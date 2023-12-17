const { createNewGame } = require("./updatedb/newGame.js")
const { verify, updateDB } = require('./updatedb/verify');
const { exportGame } = require('./updatedb/exportGame.js')
const { tokenToID } = require('./jwt.js')
const { insertPlayer, returnPlayers } = require('./updatedb/players.js')

const http = require('http');
const WebSocket = require('ws');
const { send } = require("process");

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', async ws => {
    ws.userToken = null;
    ws.on('message', (e) => handleMessage(ws, e));
    ws.on('close', (e) => handleClose(ws, e));
    
});

async function handleMessage(ws, data) {
    const str = data.toString();
    try {
        const query = JSON.parse(str);
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
        const color = await insertPlayer(query.id, id)
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
    createNewGame(query.fen)
        .then(id => {
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
            messages.push(query.uci);
            wss.clients.forEach((client) => {
                if (client.gameId === query.id) {
                    clientCount++;
                    client.send(JSON.stringify({ uci: query.uci }));
                    if (res.result) {
                        if (messages.length === 1) { messages.push(res.result, res.reason) }
                        client.send(JSON.stringify({ result: res.result, reason: res.reason }));
                    }
                }
            });
            console.log(`Sent ${messages} to game ${query.id} (${clientCount} clients)`);
        })
        .catch(err => {
            console.log(`${query.uci} to ${query.id} was invalid, sending response`);
            console.log(err)
            wss.clients.forEach((client) => {
                if (client.gameId === query.id) {
                    console.log('sending invalid')
                    client.send(JSON.stringify({ invalid: true, uci: query.uci }));
                }
            });
        })
}

async function sendExport(ws, query) {
    try {
        const res = await exportGame(query.id)
        ws.gameId = query.id
        console.log(`Client of ${ws.gameId} has connected`)
        ws.send(JSON.stringify({ exportedGame: res, id: query.id }))
        if(query.token) {
            setPlayerSide(ws, query)
        } else {
            const { whitePlayer, blackPlayer } = await returnPlayers(query.id)
            sendParticipants(query, whitePlayer.username, blackPlayer.username)
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

function handleClose(ws) {
    console.log(`One client of ${ws.gameId} has disconnected`)
}

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
