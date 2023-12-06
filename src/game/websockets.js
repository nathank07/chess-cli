import { createGame, fetchMove, importGame } from "../chess/board";
import { undoMove } from "../chess/modify";
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
                            if(response.uci.slice(0, 4) !== lastMove) {
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