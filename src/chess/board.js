import createPiece, { cloneGame, makeDraggable } from "./pieces/piece.js"


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
    history: []
}

export function firstPosition(chessGame) {
    if(chessGame.previousPosition === null) {
        return chessGame
    }
    return firstPosition(chessGame.previousPosition)
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

function animateMove(game, fromX, fromY, toX, toY, side = true, duration = 200) {
    if(game.board[fromX][fromY] && game.board[fromX][fromY].move(toX, toY)) {
        const initialDiv = document.querySelector(`[notation=${convertLocationToNotation(fromX, fromY)}]`).firstChild
        const destination = document.querySelector(`[notation=${convertLocationToNotation(toX, toY)}]`).getBoundingClientRect()
        const size = initialDiv.offsetWidth / 2
        const fromXloc = initialDiv.getBoundingClientRect().left + size
        const fromYloc = initialDiv.getBoundingClientRect().top + size
        const toXloc = destination.left + size
        const toYloc = destination.top + size
        initialDiv.animate([
            { transform: 'translate(0px, 0px)' },
            { transform: `translate(${toXloc - fromXloc}px, ${toYloc - fromYloc}px)` }
        ], {
            duration: duration,
            iterations: 1
        })
        setTimeout(() => {
            renderBoard(game, side)
        }, duration)
    }
}

export function renderBoard(game, whiteSide = true, history = false) {
    const boardDiv = document.querySelector("#board")
    boardDiv.innerHTML = ""
    const board = whiteSide ? [...game.board].reverse() : game.board
    const increment = whiteSide ? -1 : 1
    let darkSquare = true
    let x = whiteSide ? 7 : 0
    board.forEach(row => {
        let y = whiteSide ? 7 : 0
        const newRow = whiteSide ? [...row].reverse() : row
        newRow.forEach(square => {
            const div = document.createElement('div')
            div.setAttribute("notation", convertLocationToNotation(x, y))
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
    markHoveredPieces()
    return document.querySelector("#board img");
}


export function loadGame(game, white) {
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
    
    createPiece("pawn", false, 4, 4)
    renderBoard(game, white)
    game.history.push(cloneGame(game))
    animateMove(game, 1, 3, 3, 3, white)
    setTimeout(() => animateMove(game, 4, 4, 3, 3, white), 200)
}

export default chessGame