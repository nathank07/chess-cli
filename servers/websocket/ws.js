const { createNewGame } = require("./updatedb/newGame.js")
const { verify, updateDB } = require('./updatedb/verify');
const { exportGame } = require('./updatedb/exportGame.js')

const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
});

const wss = new WebSocket.Server({ server });



wss.on('connection', ws => {
    ws.on('message', data => {
        const str = data.toString();
        try {
            const query = JSON.parse(str);
            if(query.fen) {
                createNewGame(query.fen)
                    .then(id => {
                        ws.send(id);
                    })
                    .catch(err => {
                        ws.send("Could not create game: ", err)
                    })
            }
            if(query.id && query.uci) {
                console.log(`Recieved ${query.uci} request to ${query.id}`)
                verify(query.uci, query.id)
                    .then(res => {
                        if(res) {
                            console.log(res)
                            updateDB(query.uci, query.id)
                            .then(() => {
                                wss.clients.forEach((client) => {
                                    if(client.gameId === query.id) {
                                        console.log(`Sent ${query.uci} to`, client.gameId)
                                        client.send(JSON.stringify({uci: query.uci}))
                                        if(res.result) {
                                            console.log(`Sent ${res.result} ${res.reason} to`, client.gameId)
                                            client.send(JSON.stringify({ result: res.result, reason: res.reason }))
                                        }
                                    }
                                })
                            })
                            .catch((rej) => {
                                console.log("Database could not be updated", rej)
                                ws.send(rej)
                            })
                        } else {
                            console.log(`${query.uci} to ${query.id} was invalid, sending response`)
                            wss.clients.forEach((client) => {
                                if(client.gameId === query.id) {
                                    console.log(`Sent ${query.uci} to`, client.gameId)
                                    client.send(JSON.stringify({invalid: true, uci: query.uci}))
                                }
                            })
                        }
                    })
                    .catch(rej => {
                        console.log(rej)
                    })
            }
            if(query.id && !query.uci) {
                exportGame(query.id)
                    .then(res => {
                        console.log(`Exported ${query.id}`)
                        ws.gameId = query.id
                        console.log(`Set websocket game id: ${ws.gameId}`)
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
        console.log(`One watcher of ${ws.gameId} has disconnected`)
    });
});


server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
