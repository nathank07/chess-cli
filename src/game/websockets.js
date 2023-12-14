import { createGame, fetchMove, importGame } from "../chess/board";
import { undoMove, flipBoard } from "../chess/modify";
import { updateToast } from "./main.js";

export async function createWSGame(fen) {
    return new Promise((resolve, reject) => {
        const chessGame = createGame(fen)
        try {
            const socket = new WebSocket('ws://localhost:8080')
            socket.onopen = () => {
                socket.send(JSON.stringify({fen: fen ? fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}))
            };
            socket.onmessage = (event) => {
                chessGame.id = event.data
                resolve(chessGame.id)
            };
        } catch (e) {
            reject(e)
        }
    })
}

export async function createWebSocket(id) {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket('ws://localhost:8080')
    
        socket.onopen = () => {
            socket.send(JSON.stringify({ id: id }));
        };
        socket.addEventListener('message', fetchGame)
        socket.onerror = (error) => {
            reject(error);
        };
        function fetchGame(e) {
            const data = JSON.parse(e.data)
            if(data.exportedGame) {
                const importedGame = importGame(data.exportedGame);
                importedGame.id = data.id
                importedGame.socket = socket
                if(importedGame && importedGame.div) {
                    socket.addEventListener('message', (e) => {
                        const response = JSON.parse(e.data)
                        if(response.uci) {
                            const lastMove = importedGame.lastMove ? importedGame.lastMove[0] + importedGame.lastMove[1] : ""
                            if(response.invalid && response.uci.slice(0, 4) === lastMove) {
                                updateToast("Server rejected move. Try refreshing?")
                                undoMove(importedGame)
                                return
                            }
                            if(response.uci.slice(0, 4) !== lastMove && !response.invalid) {
                                fetchMove(importedGame, response.uci, true);
                            }
                        }
                        if(response.result) {
                            importedGame.result = { result: response.result, reason: response.reason }
                            updateToast(importedGame.result)
                        }
                    })
                    socket.removeEventListener('message', fetchGame)
                    resolve(importedGame);
                }
            }
        }
    });
}

export async function existingGame(id, parentDiv) {
    return new Promise((resolve, reject) => {
        createWebSocket(id)
            .then(game => {
                if(parentDiv) {
                    parentDiv.appendChild(game.div)
                }
                resolve(game)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export default async function newGame(fen, parentDiv) {
    return new Promise((resolve, reject) => {
        createWSGame(fen)
        .then(id => {
            createWebSocket(id)
                .then(game => {
                    if(parentDiv) {
                        parentDiv.appendChild(game.div)
                    }
                    resolve(game)
                })
                .catch(error => {
                    reject(error)
                })
        })
        .catch(error => {
            reject(error)
        })
    })
}

export async function joinGame(game) {
    return new Promise((resolve, reject) => {
        game.socket.send(JSON.stringify({ token: localStorage.getItem('token'), id: game.id }));
        game.socket.addEventListener('message', sendSide)

        function sendSide(e) {
            setTimeout(() => {
                reject("Could not join game")
                game.socket.removeEventListener('message', sendSide)
            }, 5000)
            const response = JSON.parse(e.data)
            if(response.isWhite !== undefined) {
                console.log(response, response.isWhite)
                resolve(response.isWhite)
                game.socket.removeEventListener('message', sendSide)
            }
        }
    })
}

export function createTokenAndJoin(game) {
    return new Promise((resolve, reject) => {
        let auth
        if(localStorage.getItem('token')) {
            auth = localStorage.getItem('token')
        }
        fetch("/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth
            },
        })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem('token', res.token)
                joinGame(game)
                    .then(color => {
                        console.log(color)
                        game.playerIsWhite = color
                        if(color === false) {
                            flipBoard(game)
                        }
                        resolve(color)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
            .catch(err => {
                reject(err)
            })
    })
}