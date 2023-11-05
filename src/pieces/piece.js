import chessGame from "../main.js"
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
            console.log(toX, toY)
            const moves = filterLegal(xPos, yPos, isWhite, standardMoves(), game.board)
            if(game.whitesMove === isWhite && moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
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
                return true;
            }
            return false
        }

    }
}

export function makeDraggable(square, svg, renderBoard){
    let drag
    svg.addEventListener('mousedown', (e) => {
        e.preventDefault()
        drag = true
    })
    document.addEventListener('mousemove', (e) => {
        e.preventDefault()
        if(e.buttons === 1 && drag) {
            const offset = svg.width / 2
            const x = e.clientX - svg.x - offset
            const y = e.clientY - svg.y - offset
            svg.style.transform = `translate(${x}px, ${y}px)`
        }
    })
    svg.addEventListener('mouseup', (e) => {
        e.preventDefault()
        const regex = /translate\(([-\d.]+)px, ([-\d.]+)px\)/;
        const xy = svg.style.transform.match(regex)
        drag = false
        if(xy) {
            const y = Math.round(xy[1] / svg.width) + square.yPos
            const x = Math.round(xy[2] / svg.width) + square.xPos
            square.move(x, y)
            renderBoard()
        }
    })
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
