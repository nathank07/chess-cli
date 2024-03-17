import { createGame, fetchMove, importGame } from "../chess/board";
import { undoMove, flipBoard, changePlayerSide } from "../chess/modify";
import { updateToast } from "./main.js";
import ChessTimer from "../chess/timer.js";

export async function createWSGame(fen, timeControl) {
    return new Promise(async (resolve, reject) => {
        const chessGame = createGame(fen)
        const token = await getToken()
        try {
            const socket = new WebSocket('ws://localhost:8080')
            socket.onopen = () => {
                socket.send(JSON.stringify({fen: fen ? fen : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
                                            timeControl: timeControl ? timeControl : { seconds: 300, increment: 1 },
                                            token: token }));
            };
            socket.onmessage = (event) => {
                const invalid = JSON.parse(event.data).invalid
                if(invalid) {
                    reject(invalid)
                    socket.close();
                    return;
                }
                chessGame.id = event.data
                resolve(chessGame.id)
            };
        } catch (e) {
            reject(e)
        }
    })
}

export async function createWebSocket(id, timeFunction) {
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
                    let whiteClock
                    let blackClock
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
                                if(importedGame.timer) {
                                    importedGame.timer.alternate()
                                }
                            }
                        }
                        if(response.result) {
                            importedGame.result = { result: response.result, reason: response.reason }
                            if(whiteClock && blackClock) {
                                whiteClock.pause()
                                blackClock.pause()
                            }
                            updateToast(importedGame.result)
                            changePlayerSide(importedGame, true)
                        }
                        if(response.whiteUser) {
                            importedGame.whiteUserSpan.textContent = response.whiteUser
                        }
                        if(response.blackUser) {
                            importedGame.blackUserSpan.textContent = response.blackUser
                        }
                        if(response.whiteClock && response.blackClock) {
                            whiteClock = ChessTimer(response.whiteClock, response.increment)
                            blackClock = ChessTimer(response.blackClock, response.increment)
                            importedGame.whiteClock = whiteClock
                            importedGame.blackClock = blackClock
                            if(timeFunction) { timeFunction(importedGame) }
                            if(response.activeClock) {
                                response.activeClock === "white" ? whiteClock.start() : blackClock.start()
                            }
                        }
                        if(response.startClock) {
                            response.startClock === "white" ? whiteClock.start() : blackClock.start()
                        }
                        if(response.stopClock) {
                            response.stopClock === "white" ? whiteClock.pause() : blackClock.pause()
                        }
                        if(response.update) {
                            if(response.update.whiteClock && whiteClock) {
                                whiteClock.length = response.update.whiteClock.length
                                whiteClock.timerStarted = response.update.whiteClock.timerStarted
                            }
                            if(response.update.blackClockUpdate && blackClock) {
                                blackClock.length = response.update.blackClockUpdate.length
                                blackClock.timerStarted = response.update.blackClockUpdate.timerStarted
                            }
                        }
                        console.log(response)
                    })
                    socket.removeEventListener('message', fetchGame)
                    resolve(importedGame);
                }
            }
        }
    });
}

export async function existingGame(id, parentDiv, timeFunction) {
    return new Promise((resolve, reject) => {
        // id must be string if not weird things happen
        createWebSocket(`${id}`, timeFunction)
            .then(game => {
                if(parentDiv) {
                    parentDiv.innerHTML = "";
                    parentDiv.appendChild(game.div)
                }
                resolve(game)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export default async function newGame(fen, timeControl) {
    return new Promise((resolve, reject) => {
        createWSGame(fen, timeControl)
        .then(id => {
            createWebSocket(id)
                .then(game => {
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

export async function joinGame(game, joinAsBlack) {
    return new Promise((resolve, reject) => {
        console.log(joinAsBlack)
        game.socket.send(JSON.stringify({ token: localStorage.getItem('token'), id: game.id, joinAsBlack: joinAsBlack }));
        game.socket.addEventListener('message', sendSide)

        function sendSide(e) {
            setTimeout(() => {
                reject("Could not join game")
                game.socket.removeEventListener('message', sendSide)
            }, 5000)
            const response = JSON.parse(e.data)
            if(response.isWhite !== undefined) {
                resolve(response.isWhite)
                game.socket.removeEventListener('message', sendSide)
            }
        }
    })
}

export function createTokenAndJoin(game, joinAsBlack) {
    return new Promise(async (resolve, reject) => {
        getToken().then(() => {
            joinGame(game, joinAsBlack)
                .then(isWhite => {
                    game.playerIsWhite = isWhite
                    const spectating = isWhite == null
                    let toastString = "You are " + (spectating ? "spectating" : `playing as ${isWhite ? "white" : "black"}`)
                    if(isWhite === false) {
                        flipBoard(game)
                    }
                    resolve(toastString)
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

function getToken() {
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
            .then(async res => {
                const statusCode = res.status
                res = await res.json()
                res.statusCode = statusCode
                return res
            })
            .then(res => {
                if(res.statusCode === 401) {
                    resolve("You are spectating. Log in to play.")
                    return
                }
                localStorage.setItem('token', res.token)
                resolve(res.token)
            })
            .catch(err => {
                reject(err)
            })
    })
}