import createPiece, { cloneGame, makeDraggable } from "./pieces/piece.js"
import isWhite from "../main.js"
import animateMove from "./animations.js"

const chessGame = {
    board: [...Array(8)].map(e => Array(8).fill(null)),
    whitesMove: true,
    whiteState: {
        shortCastle: true,
        longCastle: true,
    },
    blackState: {
        shortCastle: true,
        longCastle: true,
    },
    history: [],
    lastMove: null
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
    return `${file[xPos]}${yPos + 1}`
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
    return [file[notation[0]], Number(notation[1]) - 1]
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
            darkSquare = !darkSquare
            if(darkSquare) { div.classList.add('darkSquare') }
            const pieceSvg = square ? square.svg : false
            if(pieceSvg) {
                const svg = document.createElement('img')
                svg.src = pieceSvg
                !history ? makeDraggable(square, svg, renderBoard) : ""
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

const moves = [
    [1, 3, 3, 3],
    [6, 4, 4, 4],
    [0, 4, 2, 2],
    [4, 4, 3, 3],
    [2, 2, 3, 2],
    [7, 1, 5, 2],
    [0, 6, 2, 5],
    [7, 4, 5, 4],
    [1, 2, 2, 2],
    [5, 4, 3, 2],
    [1, 4, 2, 4],
    [3, 2, 5, 4],
    [0, 1, 2, 0],
    [3, 3, 2, 4],
    [0, 5, 3, 2],
    [2, 4, 1, 4],
    [0, 3, 0, 4],
    [5, 4, 7, 4],
    [2, 0, 4, 1],
    [7, 0, 7, 1],
    [0, 2, 3, 5],
    [6, 0, 5, 0],
    [3, 5, 6, 2],
    [7, 3, 6, 4],
    [6, 2, 7, 1],
    [5, 2, 7, 1],
    [4, 1, 3, 3],
    [6, 1, 4, 1],
    [3, 2, 4, 3],
    [6, 4, 5, 3],
    [4, 3, 2, 1],
    [7, 1, 5, 2],
    [0, 0, 0, 2],
    [5, 2, 3 ,3],
    [2, 2, 3, 3],
    [7, 2, 6, 1],
    [1, 0, 3, 0],
    [4, 1, 3, 0],
    [2, 1, 3, 0],
    [6, 1, 2, 5],
    [1, 6, 2, 5],
    [7, 6, 5, 5],
    [2, 5, 3, 5],
    [5, 5, 3, 6],
    [0, 7, 0, 6],
    [3, 6, 1, 7],
    [0, 6, 4, 6],
    [1, 7, 2, 5]
]

export function loadGame(game) {
    for(let i = 0; i < 8; i++) {
        createPiece("pawn", true, 1, i)
        createPiece("pawn", false, 6, i)
    }
    createPiece("rook", true, 0, 0)
    createPiece("rook", true, 0, 7)
    createPiece("rook", false, 7, 7)
    createPiece("rook", false, 7, 0)
    
    createPiece("knight", true, 0, 1)
    createPiece("knight", true, 0, 6)
    createPiece("knight", false, 7, 6)
    createPiece("knight", false, 7, 1)
    
    createPiece("bishop", true, 0, 2)
    createPiece("bishop", true, 0, 5)
    createPiece("bishop", false, 7, 5)
    createPiece("bishop", false, 7, 2)
    
    
    createPiece("queen", true, 0, 4)
    createPiece("king", false, 7, 3)
    createPiece("queen", false, 7, 4)
    createPiece("king", true, 0, 3)
    
    renderBoard(game)
    game.history.push(cloneGame(game))

    animateGame(game, moves, 1000)
}

export default chessGame