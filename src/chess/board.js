import createPiece, { inCheck, gameOver } from "./pieces/piece.js"
import { convertLocationToNotation, convertNotationtoLocation } from "./notation.js"
import makeDraggable from "./drag.js"
import { createSVGCanvas, addUserMarkings, drawUserMarkings, annotateBoard, markHoveredPieces } from "./marking.js"
import animateMove from "./animations.js"
import place from "./sounds/Move.ogg"
import capture from "./sounds/Capture.ogg"
import check from "./sounds/Check.wav"
import randomMove from "../game/random.js"
import { undoMove } from "./modify.js"
import { newHistoryCell, updateToast } from "../game/main.js"

const sounds = {
    "place": place,
    "capture": capture,
    "check": check
}

export function FENtoBoard(FENstring) {
    const whiteUserSpan = document.createElement('span')
    const blackUserSpan = document.createElement('span')
    whiteUserSpan.classList.add('whiteUser')
    blackUserSpan.classList.add('blackUser')
    const chessGame = {
        board: [...Array(8)].map(e => Array(8).fill(null)),
        div: null,
        whitesMove: true,
        whiteState: {
            shortCastle: false,
            longCastle: false,
        },
        blackState: {
            shortCastle: false,
            longCastle: false,
        },
        history: [],
        timeline: 0,
        lastMove: null,
        lastMoveSound: null,
        drawnArrows: [],
        userHighlights: [],
        playerIsWhite: true,
        showingWhiteSide: true,
        fiftyMoveRule: 0,
        export: [FENstring],
        whiteUserSpan: whiteUserSpan,
        blackUserSpan: blackUserSpan,
    }
    
    const pieces = {
        "p": "pawn",
        "q": "queen",
        "b": "bishop",
        "n": "knight",
        "r": "rook",
        "k": "king"
    }

    FENstring = FENstring.split(" ")

    const board = [...FENstring[0].split("/")].reverse()

    board.forEach((row, i) => {
        row = row.replace(/\d+/g, (number) => {
            return "#".repeat(Number(number))
        })
        row.split("").reverse().forEach((char, j) => {
            const isWhite = char === char.toUpperCase()
            if(char !== "#") {
                createPiece(pieces[char.toLowerCase()], isWhite, i, j, chessGame)
            }
        });
    });
    
    chessGame.whitesMove = FENstring[1] === "w"

    FENstring[2].split("").forEach(char => {
        if(char === "k") {
            chessGame.blackState.shortCastle = true
        }
        if(char === "q") {
            chessGame.blackState.longCastle = true
        }
        if(char === "K") {
            chessGame.whiteState.shortCastle = true
        }
        if(char === "Q") {
            chessGame.whiteState.longCastle = true
        }
    });

    if(FENstring[3] !== "-") {
        const loc = convertNotationtoLocation(FENstring[3])
        createPiece("passant", !chessGame.whitesMove, loc[0], loc[1], chessGame)
    }

    chessGame.fiftyMoveRule = Number(FENstring[4])

    return chessGame
}

export function gametoFEN(game) {
    const pieces = {
        "pawn": "p",
        "queen": "q", 
        "bishop": "b",
        "knight": "n",
        "rook": "r",
        "king": "k",
    }

    let number = 0
    let FEN = ""
    let passantSquare
    [...game.board].reverse().forEach((row, i) => {
        [...row].reverse().forEach((square, j) => {
            if(square === null) {
                number += 1
            }
            if(square && square.name === "passant") {
                number += 1
                passantSquare = [7 - i, 7 - j]
            }
            if(square && square.name !== "passant") {
                const piece = pieces[square.name]
                FEN += number ? number : ""
                FEN += square.isWhite ? piece.toUpperCase() : piece
                number = 0
            }
        })
        FEN += number ? number : ""
        number = 0
        FEN += "/"
    })
    FEN = FEN.substring(0, FEN.length - 1) + " "

    FEN += game.whitesMove ? "w " : "b "

    if(game.whiteState.shortCastle) {
        FEN += "K"
    }
    if(game.whiteState.longCastle) {
        FEN += "Q"
    }
    if(game.blackState.shortCastle) {
        FEN += "k"
    }
    if(game.blackState.longCastle) {
        FEN += "q"
    }
    if(!game.whiteState.shortCastle && !game.whiteState.longCastle && !game.blackState.shortCastle && !game.blackState.longCastle) {
        FEN += "-"
    }

    FEN += " "

    FEN += passantSquare ? convertLocationToNotation(passantSquare[0], passantSquare[1]) : "-"
    FEN += ` ${game.fiftyMoveRule} ${Math.floor((game.export.length - 1) / 2) + 1}`

    return FEN
}


export function playSound(game) {
    if(game.lastMoveSound) {
        const sound = new Audio(sounds[game.lastMoveSound])
        sound.play()
    }
}

export function renderBoard(game) {
    const whiteSide = game.showingWhiteSide
    const boardDiv = game.div.firstChild;
    const history = game.timeline
    boardDiv.innerHTML = ""
    if(boardDiv.parentNode.querySelector('#svg-canvas')) {
        boardDiv.parentNode.querySelector('#svg-canvas').remove()
    }
    const board = whiteSide ? [...game.board].reverse() : game.board
    const increment = whiteSide ? -1 : 1
    const highlighted = game.lastMove !== null
    let darkSquare = true
    let x = whiteSide ? 7 : 0
    const canvas = createSVGCanvas(boardDiv)
    board.forEach(row => {
        let y = whiteSide ? 7 : 0
        const newRow = whiteSide ? [...row].reverse() : row
        newRow.forEach(square => {
            const div = document.createElement('div')
            const notation = convertLocationToNotation(x, y)
            div.setAttribute("notation", notation)
            div.classList.add("square")
            addUserMarkings(div, game, canvas)
            darkSquare = !darkSquare
            if(darkSquare) { div.classList.add('dark') }
            const pieceSvg = square ? square.svg : false
            if(pieceSvg) {
                const svg = document.createElement('img')
                svg.src = pieceSvg
                if(history === 0 && !game.result) {
                    if(game.playerIsWhite !== null && square.isWhite === game.playerIsWhite && game.playerIsWhite === game.whitesMove) {
                        makeDraggable(square, svg, renderBoard)
                    }
                }
                div.appendChild(svg)
            }
            boardDiv.appendChild(div)
            y += increment
        });
        darkSquare = !darkSquare
        x += increment
    });
    const checkLocation = inCheck(game)
    if(checkLocation) {
        boardDiv.querySelector(`[notation=${checkLocation}]`).classList.add("check")
    }
    if(highlighted) {
        boardDiv.querySelector(`[notation=${game.lastMove[0]}`).classList.add("highlighted")
        boardDiv.querySelector(`[notation=${game.lastMove[1]}`).classList.add("highlighted")
    }
    if(game.result) {
        updateToast(game.result)
    }
    drawUserMarkings(game, canvas)
    annotateBoard(boardDiv, whiteSide)
    markHoveredPieces(boardDiv)
    return boardDiv
}

export async function waitForMove(game) {
    const move = await randomMove(game, !game.playerIsWhite)
    if(move) {
        game.board[move[0][0]][move[0][1]].move(move[1][0], move[1][1])
        postMove(game, false, game.socket)
        undoMove(game, false)
    }
    else {
        console.log("no moves left")
    }
}

export function fetchMove(game, UCI, sound = true, ignoreGameOver = false, ignoreLegality = false) {
    const startSquare = convertNotationtoLocation(UCI.substring(0, 2).toLowerCase())
    const endSquare = convertNotationtoLocation(UCI.substring(2, 4).toLowerCase())
    const promotion = UCI.substring(4, 5) 
    const pieces = {
        "q": "queen",
        "r": "rook",
        "n": "knight",
        "b": "bishop"
    }
    const promotionPiece = promotion ? pieces[promotion.toLowerCase()] : false
    if(ignoreLegality) {
        game.board[startSquare[0]][startSquare[1]].move(endSquare[0], endSquare[1], promotionPiece, false, true)
        return game;
    }
    if(animateMove(game, startSquare[0], startSquare[1], endSquare[0], endSquare[1], sound, promotionPiece)) {
        game.export.push(UCI)
        if(!ignoreGameOver) {
            const end = gameOver(game)
            if(end) {
                game.result = { result: end.result, reason: end.reason }
            }
        }
        const ol = document.querySelector('ol')
        if(ol) {
            newHistoryCell(game, ol)
        }
        return game
    } else {
        throw new Error("Could not complete move.")
    }
}

export function postMove(game, promotion, socket) {
    const UCI = game.lastMove.join('').concat(promotion ? promotion[0] : "")
    if(socket) {
        if(socket.readyState === 3) {
            undoMove(game, false)
            updateToast("Not connected to the game. Try refreshing?")
            return
        }
        socket.send(JSON.stringify({
            uci: UCI,
            id: game.id, 
            token: localStorage.getItem('token')
        }))
        if(game.timer) {
            game.timer.alternate()
        }
        const ol = document.querySelector('ol')
        if(ol) {
            newHistoryCell(game, ol)
        }
    }
    const end = gameOver(game)
    if(end) {
        game.result = { result: end.result, reason: end.reason }
    }
    game.export.push(UCI)
    return UCI
}

export function animateGame(game, moves, sound, msspeed = 1000) {
    const interval = setInterval(() => {
        if(moves.length === 0) {
            clearInterval(interval)
            return
        }
        const move = moves.shift()
        fetchMove(game, move, sound)
    }, msspeed)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, msspeed * (moves.length + 2))
    })
}

export function createGame(fen, render = false) {
    const boardContainer = document.createElement('div');
    const boardDiv = document.createElement('div');
    boardContainer.id = "board-container"
    boardDiv.id = "board";
    boardContainer.appendChild(boardDiv)
    boardContainer.oncontextmenu = () => {return false}
    if(!fen) {
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    }
    const chessGame = FENtoBoard(fen)
    chessGame.div = boardContainer
    if(render) {
        renderBoard(chessGame)
    }
    return chessGame
}

// Example input: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", ["d2d4", "d7d5"]] 

export function importGame(fenUCIexport) {
    const chessGame = createGame(fenUCIexport[0], true)
    if(fenUCIexport.length > 1) {
        fenUCIexport.slice(1).forEach(arr => {
            arr.forEach(move => {
                if(move === "") {
                    return
                } 
                fetchMove(chessGame, move, false, true, true)
            });
        });
    }
    chessGame.result = gameOver(chessGame)
    renderBoard(chessGame)
    return chessGame   
}

