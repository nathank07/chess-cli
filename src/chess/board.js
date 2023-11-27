import createPiece, { inCheck } from "./pieces/piece.js"
import { convertLocationToNotation, convertNotationtoLocation } from "./notation.js"
import makeDraggable from "./drag.js"
import { createSVGCanvas, addUserMarkings, drawUserMarkings, annotateBoard, markHoveredPieces } from "./marking.js"
import animateMove from "./animations.js"
import place from "./sounds/Move.ogg"
import capture from "./sounds/Capture.ogg"
import check from "./sounds/Check.wav"
import randomMove from "../random.js"
import { undoMove } from "./modify.js"

const sounds = {
    "place": place,
    "capture": capture,
    "check": check
}

export function FENtoBoard(FENstring, startWebSocket) {
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
                if(!history) {
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

export function fetchMove(game, UCI, sound = true) {
    const startSquare = convertNotationtoLocation(UCI.substring(0, 2).toLowerCase())
    const endSquare = convertNotationtoLocation(UCI.substring(2, 4).toLowerCase())
    const promotion = UCI.substring(4, 5)
    const pieces = {
        "q": "queen",
        "r": "rook",
        "n": "knight",
        "b": "bishop"
    }
    if(animateMove(game, startSquare[0], startSquare[1], endSquare[0], endSquare[1], sound, promotion ? pieces[promotion.toLowerCase()] : false)) {
        if(game.fiftyMoveRule > 100) {
            undoMove(game)
            throw new Error("fifty move rule")
        }
        game.export.push(UCI)
        return game
    } else {
        throw new Error("Could not complete move.")
    }
}

export function postMove(game, promotion, socket) {
    const UCI = game.lastMove.join('').concat(promotion ? promotion[0] : "")
    if(game.fiftyMoveRule > 100) {
        undoMove(game)
        throw new Error("fifty move rule")
    }
    if(socket) {
        socket.send(JSON.stringify({
            uci: UCI,
            id: game.id, 
        }))
    }
    game.export.push(UCI)
    return UCI
}


export function createGame(fen) {
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
    renderBoard(chessGame)
    return chessGame
}

export function importGame(fenUCIexport) {
    const chessGame = createGame(fenUCIexport[0])
    if(fenUCIexport.length > 1) {
        fenUCIexport.slice(1).forEach(arr => {
            arr.forEach(move => {
                fetchMove(chessGame, move, false)
            });
        });
    }
    renderBoard(chessGame)
    return chessGame   
}

