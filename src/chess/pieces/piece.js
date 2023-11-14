import chessGame, { convertLocationToNotation, convertNotationtoLocation, markLegalMoves, playSound } from "../board.js"
import King from "./king.js"
import Queen from "./queen.js"
import Rook from "./rook.js"
import Knight from "./knight.js"
import Bishop from "./bishop.js"
import Pawn from "./pawn.js"
import blackKing from '../cburnett/bK.svg' 
import whiteKing from '../cburnett/wK.svg' 
import blackQueen from '../cburnett/bQ.svg'
import whiteQueen from '../cburnett/wQ.svg'
import blackRook from '../cburnett/bR.svg' 
import whiteRook from '../cburnett/wR.svg' 
import blackBishop from '../cburnett/bB.svg' 
import whiteBishop from '../cburnett/wB.svg' 
import blackKnight from '../cburnett/bN.svg' 
import whiteKnight from '../cburnett/wN.svg' 
import blackPawn from '../cburnett/bP.svg' 
import whitePawn from '../cburnett/wP.svg' 
import animateMove from "../animations.js"

const blackPieces = {
    "pawn": blackPawn,
    "king": blackKing, 
    "queen": blackQueen, 
    "bishop": blackBishop, 
    "knight": blackKnight, 
    "rook": blackRook
}
const whitePieces = { 
    "pawn": whitePawn,
    "king": whiteKing, 
    "queen": whiteQueen, 
    "bishop": whiteBishop, 
    "knight": whiteKnight, 
    "rook": whiteRook
}

export function Piece ( { name, isWhite, xPos, yPos, standardMoves, game } ) { 
    return {
        name: name,
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        standardMoves: standardMoves,
        game: game,
        svg: isWhite ? whitePieces[name] || false : blackPieces[name] || false,

        canCapture: (capturedPiece) => {
            return capturedPiece ? isWhite !== capturedPiece.isWhite : false
        },

        move: (toX, toY) => {
            const moves = filterLegal(xPos, yPos, isWhite, standardMoves(), game.board)
            if(game.whitesMove === isWhite && moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
                game.history.push(cloneGame(game))
                game.lastMove = [convertLocationToNotation(xPos, yPos), convertLocationToNotation(toX, toY)]
                game.lastMoveSound = game.board[toX][toY] === null ? "place" : "capture"
                if(game.board[toX][toY] && name !== "pawn" && game.board[toX][toY].name === "passant") {
                    game.lastMoveSound = "place"
                }
                // Remove any en passant remnants
                for(let i = 0; i < 8; i++) {
                    if(game.board[2][i] && game.board[2][i].name === "passant") {
                        game.board[2][i] = null
                        break
                    }
                    if(game.board[5][i] && game.board[5][i].name === "passant") {
                        game.board[5][i] = null
                        break
                    }
                }

                // Move piece and change side's move
                createPiece(name, isWhite, toX, toY, game)
                game.board[xPos][yPos] = null
                game.whitesMove = !game.whitesMove

                // Any additional things you may want a piece to do
                if(moves[index].length > 2) {
                    moves[index][2]()
                }
                return true
            }
            return false
        }

    }
}

export function cloneGame(game) {
    return {
        board: cloneBoard(game.board),
        whitesMove: game.whitesMove,
        lastMove: game.lastMove,
        lastMoveSound: game.lastMoveSound,
        whiteState: {
            shortCastle: game.whiteState.shortCastle,
            longCastle: game.whiteState.longCastle,
        },
        blackState: {
            shortCastle: game.blackState.shortCastle,
            longCastle: game.blackState.longCastle,
        }
    }
}

export function makeDraggable(square, svg, renderBoard){
    svg.addEventListener('mousedown', (e) => {
        e.preventDefault()

        const alreadyHighlighted = svg.parentNode.classList.contains("highlighted")
        // render board and set svg (since svg changes when you render board) so it resets users selection if there is one
        renderBoard(square.game)
        svg = document.querySelector(`[notation=${convertLocationToNotation(square.xPos, square.yPos)}`).lastChild

        let size = svg.offsetWidth
        const initialSquare = svg.parentNode
        let outsideInitialSquare = false;
        if(e.buttons === 1) {
            const moves = filterLegal(square.xPos, square.yPos, square.isWhite, square.standardMoves(), square.game.board)
            markLegalMoves(moves, mouseUp)
            // Set size here everytime in case user resizes window
            size = svg.offsetWidth
            // We declare the event listeners here to the document 
            // because pointer-events: none unbinds the svg event listeners
            document.addEventListener('mousedown', mouseDown) 
            document.addEventListener('mousemove', mouseMove)
            document.addEventListener('mouseup', mouseUp)
            document.addEventListener('click', clear)
            moveToCursor(e, svg, size)
        }
        // Clears user selection if they click off a valid move
        function clear(event) {
            event.preventDefault()
            document.removeEventListener('mousedown', mouseDown) 
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('click', clear)
            renderBoard(square.game)
        }
        function mouseDown(event) {
            // This is done so users can cancel their moves with any button
            if(event.buttons !== 1) {
                event.preventDefault()
                document.removeEventListener('mousedown', mouseDown) 
                document.removeEventListener('mouseup', mouseUp)
                document.removeEventListener('mousemove', mouseMove)
                renderBoard(square.game)
            }
        }
        function mouseMove(event) {
            if(document.querySelector("#board .square.select") !== initialSquare) {
                outsideInitialSquare = true
            }
            moveToCursor(event, svg, size)
        }
        function mouseUp(event) {
            event.preventDefault()
            document.removeEventListener('mouseup', mouseUp)
            document.removeEventListener('mousemove', mouseMove)
            svg.style.pointerEvents = "auto"
            const move = selectSquare()
            const originalPos = [square.xPos, square.yPos]
            if(move && event.buttons === 0) {
                if(event.type !== "click" && square.move(move[0], move[1])) {
                    playSound(square.game)
                    renderBoard(square.game)
                } 
                if(event.type === "click") {
                    // Clear renders board and won't show animation
                    document.removeEventListener('click', clear)
                    // Remove indicators as they're no longer relevant
                    document.querySelectorAll('.possible').forEach(square => {
                        square.classList.remove('possible')
                    });
                    animateMove(square.game, originalPos[0], originalPos[1], move[0], move[1])
                    playSound(square.game)
                }
            }
            if(!outsideInitialSquare && event.type !== "click") {
                svg.style.position = null
                if(alreadyHighlighted) {
                    clear(e)
                }
            }
        }
    })
} 

function moveToCursor(event, svg, size) {
    // Using fixed style here instead of transform because 
    // transform did not work for some users
    svg.style.pointerEvents = "none"
    svg.style.position = "fixed"
    svg.style.width = `${size}px`
    svg.style.height = `${size}px`
    const x = event.clientX - (size / 2)
    const y = event.clientY - (size / 2)
    svg.style.left = `${x}px`
    svg.style.top = `${y}px`
    svg.parentNode.classList.add('highlighted')
}

function selectSquare() {
    const notation = document.querySelector("#board .square.select")
    return notation ? convertNotationtoLocation(notation.getAttribute("notation")) : false
}

function isLegal(fromX, fromY, toX, toY, isWhite, board) {
    const boardClone = cloneBoard(board)
    const piece = boardClone[fromX][fromY]
    createPiece(piece.name, piece.isWhite, toX, toY, {board: boardClone})
    boardClone[fromX][fromY] = null
    let kingSquare;
    let moves = []
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(boardClone[i][j]) {
                const pieceMoves = boardClone[i][j].standardMoves()
                const color = boardClone[i][j].isWhite
                if(boardClone[i][j].name == "king" && color == isWhite){
                    kingSquare = [i, j]
                }
                if(color != isWhite) {
                    pieceMoves.map(move => moves.push(move))
                }
            }            
        }
    }
    if(kingSquare && moves.some(move => move[0] === kingSquare[0] && move[1] === kingSquare[1])) {
        return false;
    }
    return true
}

function filterLegal(xPos, yPos, isWhite, standardMoves, board) {
    return standardMoves.filter(move => 
        isLegal(xPos, yPos, move[0], move[1], isWhite, board)
    );
}


export function cloneBoard(board) {
    const newBoard = [...Array(8)].map(e => Array(8).fill(null));
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if(board[x][y]) {
                createPiece(board[x][y].name, board[x][y].isWhite, x, y, {board: newBoard});
            }
        }
    }
    return newBoard;
}

export function outOfBounds(x, y){
    return x < 0 || y < 0 || x >= 8 || y >= 8
}


export default function createPiece(piece, isWhite, xPos, yPos, game = chessGame) {
    let createdPiece = {};
    const pieceInfo = { isWhite: isWhite, xPos: xPos, yPos: yPos, game: game }
    switch(piece){
        case "pawn":
            createdPiece = Pawn(pieceInfo)
            break
        case "king":
            createdPiece = King(pieceInfo)
            break
        case "knight":
            createdPiece = Knight(pieceInfo)
            break
        case "rook":
            createdPiece = Rook(pieceInfo)
            break
        case "bishop":
            createdPiece = Bishop(pieceInfo)
            break
        case "queen":
            createdPiece = Queen(pieceInfo)
            break
        default:
            createdPiece = { standardMoves: () => { return [] } }
            break
    }

    const genericPiece = Piece( {
        name: piece, 
        isWhite: isWhite,
        xPos: xPos,
        yPos, yPos,
        standardMoves: createdPiece.standardMoves,
        game: game
    })

    game.board[xPos][yPos] = {
        ...genericPiece,
        ...createdPiece
    }

    return game.board[xPos][yPos]
}
