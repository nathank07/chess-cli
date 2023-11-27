const { createNewGame } = require("./db/newGame.js")
const { verify, updateDB } = require('./db/verify');
const { exportGame } = require('./db/exportGame.js')

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
});

const wss = new WebSocket.Server({ server });


const games = {};

wss.on('connection', ws => {
    ws.on('message', data => {
        const str = data.toString();
        try {
            const query = JSON.parse(str);
            if(query.fen) {
                createNewGame(query.fen)
                    .then(id => {
                        ws.send(id);
                        ws.gameId = id;
                        if (!games[id]) {
                            games[id] = [];
                        }
                        games[id].push(ws);
                        console.log(`Game ${id} created. Total clients in game: ${games[id].length}`); // Log the game creation and client addition
                    })
                    .catch(err => {
                        ws.send("Could not create game: ", err)
                    })
            }
            if(query.id && query.uci) {
                verify(query.uci, query.id)
                    .then(res => {
                        updateDB(query.uci, query.id)
                            .then(() => {
                                // Send the move to all clients subscribed to this game
                                if (games[query.id]) {
                                    games[query.id].forEach(client => {
                                        if (client.readyState === WebSocket.OPEN) {
                                            ws.send(query.uci);
                                        }
                                    });
                                }
                            })
                            .catch((rej) => {
                                console.log("Database could not be updated", rej)
                                ws.send(rej)
                            })
                    })
                    .catch(rej => {
                        console.log(rej)
                    })
            }
            if(query.id && !query.uci) {
                exportGame(query.id)
                    .then(res => {
                        ws.send(JSON.stringify({exportedGame: res, id: query.id}))
                    })
                    .catch(rej => {
                        ws.send("Error: Could not find")
                        console.log(rej)
                    })
            }
        } catch (e) {
            console.log("FAIL: ", JSON.parse(str))
            console.log(e)
        }
    });

    ws.on('close', () => {
        if (ws.gameId && games[ws.gameId]) {
            games[ws.gameId] = games[ws.gameId].filter(client => client !== ws);
            console.log(`Client disconnected. Total clients in game ${ws.gameId}: ${games[ws.gameId].length}`); // Log the client disconnection
        }
    });
});


server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
