import createPiece, { cloneBoard, cloneGame, makeDraggable } from "./pieces/piece.js"
import isWhite from "../main.js"
import animateMove, { animatePiece } from "./animations.js"
import place from "./sounds/Move.ogg"
import capture from "./sounds/Capture.ogg"
import check from "./sounds/Check.wav"

let chessGame = {
    board: [...Array(8)].map(e => Array(8).fill(null)),
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
    lastMove: null,
    lastMoveSound: null
}

const sounds = {
    "place": place,
    "capture": capture,
    "check": check
}

export function convertLocationToNotation(xPos, yPos) {
    const file = {
        0: "h",
        1: "g",
        2: "f",
        3: "e",
        4: "d",
        5: "c",
        6: "b",
        7: "a"
    }
    return `${file[yPos]}${xPos + 1}`
}

export function convertNotationtoLocation(notation) {
    const file = {
        "h": 0,
        "g": 1,
        "f": 2,
        "e": 3,
        "d": 4,
        "c": 5,
        "b": 6,
        "a": 7
    }
    return [Number(notation[1]) - 1, file[notation[0]]]
}

function FENtoBoard(FENstring) {
    
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

    return chessGame
}

function markHoveredPieces() {
    const boardSquares = document.querySelectorAll("#board .square")
    boardSquares.forEach(square => {
        square.addEventListener("mouseover", () => {
            square.classList.add("select")
        })
        square.addEventListener("mouseout", () => {
            square.classList.remove("select")
        })
    });
}

export function undoMove(game) {
    let animation;
    if(game.lastMove) {
        animation = game.lastMove
    }
    const oldBoard = cloneBoard(game.history[game.history.length - 1].board)
    chessGame.board = [...Array(8)].map(e => Array(8).fill(null));
    // We clone the board and create pieces because squares are binded to specific boards
    oldBoard.forEach((row, x) => {
        row.forEach((square, y) => {
            if(square) {
                createPiece(oldBoard[x][y].name, oldBoard[x][y].isWhite, x, y, game)
            }
        });
    });
    const oldGame = game.history[game.history.length - 1]
    game.whiteState = oldGame.whiteState
    game.blackState = oldGame.blackState
    game.lastMove = oldGame.lastMove
    game.lastMoveSound = oldGame.lastMoveSound
    game.whitesMove = oldGame.whitesMove
    if(game.history.length > 1) {
        game.history.pop()
    }
    if(animation) {
        animatePiece(animation[1], animation[0])
            .then(() => {
                renderBoard(game)
            })
    } else {
        renderBoard(game)
    }
    return game
}

export function squareDivs(moves) {
    let divs = []
    moves.forEach(move => {
        const square = convertLocationToNotation(move[0], move[1])
        const squareDiv = document.querySelector(`[notation=${square}`)
        divs.push(squareDiv)
    });
    return divs
}

export function playSound(game) {
    if(game.lastMoveSound) {
        const sound = new Audio(sounds[game.lastMoveSound])
        sound.play()
    }
}

function addUserHighlighting(squareDiv) {
    squareDiv.addEventListener('mousedown', (e) => {
        if(e.button == 2) {
            const classes = squareDiv.classList
            classes.contains("userHighlight") ? classes.remove("userHighlight") : classes.add("userHighlight")
        } else {
            const board = squareDiv.parentNode
            if(board) {
                board.querySelectorAll(".square").forEach(div => {
                    div.classList.remove("userHighlight")
                });
            }
        }
    })
}

export function renderBoard(game, history = false) {
    const whiteSide = isWhite()
    const boardDiv = document.querySelector("#board")
    boardDiv.innerHTML = ""
    const board = whiteSide ? [...game.board].reverse() : game.board
    const increment = whiteSide ? -1 : 1
    const highlighted = game.lastMove !== null
    let darkSquare = true
    let x = whiteSide ? 7 : 0
    board.forEach(row => {
        let y = whiteSide ? 7 : 0
        const newRow = whiteSide ? [...row].reverse() : row
        newRow.forEach(square => {
            const div = document.createElement('div')
            const notation = convertLocationToNotation(x, y)
            div.setAttribute("notation", notation)
            div.classList.add("square")
            addUserHighlighting(div)
            darkSquare = !darkSquare
            if(darkSquare) { div.classList.add('darkSquare') }
            const pieceSvg = square ? square.svg : false
            if(pieceSvg) {
                const svg = document.createElement('img')
                svg.src = pieceSvg
                if(!history) {
                    if(square.isWhite === game.whitesMove) {
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
    if(highlighted) {
        document.querySelector(`[notation=${game.lastMove[0]}`).classList.add("highlighted")
        document.querySelector(`[notation=${game.lastMove[1]}`).classList.add("highlighted")
    }
    markHoveredPieces()
    return document.querySelector("#board img");
}

function animateGame(game, moves, timeBetweenMoves) {
    let totalMoves = 0
    moves.map(move => {
        totalMoves++
        setTimeout(() => {
            animateMove(game, move[0], move[1], move[2], move[3])
        }, timeBetweenMoves * totalMoves)
    })
}

export function loadGame(game) {
    chessGame = FENtoBoard(game)
    renderBoard(chessGame)
    chessGame.history.push(cloneGame(chessGame))
}

export default chessGame