import { createGame, fetchMove, importGame } from "./chess/board";

export function createWSGame(fen) {
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
                        if(e.data.length <= 5) {
                            if(!importedGame.lastMove || e.data !== importedGame.lastMove[0] + importedGame.lastMove[1]) {
                                fetchMove(importedGame, e.data, true);
                            }
                        }
                    })
                    socket.removeEventListener('message', fetchGame)
                    resolve(importedGame);
                }
            }
        }
    });
}
