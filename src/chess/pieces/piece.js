import { Chess } from 'chess.js'
import { createGame, gametoFEN, postMove } from "../board.js"
import { undoMove } from "../modify.js"
import { renderBoard } from "../board.js"
import { convertLocationToNotation, convertNotationtoLocation } from "../notation.js"
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

        move: (toX, toY, promotion, post = false) => {
            const moves = standardMoves().filter(move => 
                isLegal(xPos, yPos, move[0], move[1], isWhite, game.board)
            );
            if(game.whitesMove === isWhite && moves.some(pos => pos[0] === toX && pos[1] === toY)) {
                const index = moves.findIndex(pos => pos[0] === toX && pos[1] === toY);
                game.history.push(cloneGame(game))
                game.lastMove = [convertLocationToNotation(xPos, yPos), convertLocationToNotation(toX, toY)]
                game.lastMoveSound = game.board[toX][toY] === null ? "place" : "capture"

                if(game.board[toX][toY] && name !== "pawn" && game.board[toX][toY].name === "passant") {
                    game.lastMoveSound = "place"
                }

                if(name === "pawn" || game.lastMoveSound === "capture") {
                    game.fiftyMoveRule = 0
                } else {
                    game.fiftyMoveRule += 1
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
                if(promotion) {
                    name = promotion
                }
                createPiece(name, isWhite, toX, toY, game)
                game.board[xPos][yPos] = null
                game.whitesMove = !game.whitesMove

                // Any additional things you may want a piece to do
                if(moves[index].length > 2 && !promotion) {
                    const func = moves[index][2]()
                    if(func && func[Symbol.toStringTag] === 'Promise') {
                        return (async () => {
                            const piece = await func
                            undoMove(game, false)
                            game.board[xPos][yPos].move(toX, toY, piece, true)
                            return true
                        })()
                    }
                }

                if(inCheck(game)) {
                    game.lastMoveSound = "check"
                }
                if(promotion) {
                    renderBoard(game)
                }
                if(post && game.socket) {
                    postMove(game, promotion, game.socket)
                }

                return true
            }
            return false
        },
        moves: () => {
            if(game.fiftyMoveRule > 100 || threeFoldRepetition(game) || game.whitesMove !== isWhite) {
                return []
            }
            return standardMoves().filter(move => 
                isLegal(xPos, yPos, move[0], move[1], isWhite, game.board)
            )
        }

    }
}

export function outOfBounds(x, y){
    return x < 0 || y < 0 || x >= 8 || y >= 8
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
                const color = boardClone[i][j].isWhite
                if(boardClone[i][j].name == "king" && color == isWhite){
                    kingSquare = [i, j]
                }
                if(color !== isWhite) {
                    const pieceMoves = boardClone[i][j].standardMoves()
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

export function cloneGame(game) {
    return {
        board: cloneBoard(game.board),
        div: game.div,
        whitesMove: game.whitesMove,
        showingWhiteSide: game.showingWhiteSide,
        lastMove: game.lastMove,
        lastMoveSound: game.lastMoveSound,
        drawnArrows: [],
        userHighlights: [],
        fiftyMoveRule: game.fiftyMoveRule,
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

export function inCheck(game) {
    let check = false
    game.board.forEach((row, x) => {        
        row.forEach((square, y) => {
            if(game.board[x][y] && game.board[x][y].name === "king" && game.board[x][y].inCheck()) {
                check = convertLocationToNotation(x, y)
            }
        })
    });
    return check
}

export function gameOver(game) {
    if(game.fiftyMoveRule > 100) {
        return { result: "Stalemate", reason: "Fifty move rule" }
    }
    if(threeFoldRepetition(game)) {
        return { result: "Stalemate", reason: "Threefold Repetition" }
    }
    try {
        const chess = new Chess(gametoFEN(game))
        if(chess.isCheckmate()) {
            return { result: !game.whitesMove ? "White" : "Black", reason: "Checkmate" }
        }
        if(chess.isStalemate()) {
            return { result: "Stalemate", reason: "No more moves" }
        }
        if(chess.isInsufficientMaterial()) {
            return { result: "Stalemate", reason: "Insufficient material"}
        }
    } catch (e) {
        console.log(gametoFEN(game))
        console.log(e)
        const gameOverObject = fallbackGameOver(game)
        if(gameOverObject) {
            return gameOverObject
        }
    }

    return false
}

function fallbackGameOver(game) {
    // This solution is too slow so I use chess.js for this
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(game.board[x][y] && game.board[x][y].isWhite === game.whitesMove && game.board[x][y].moves().length > 0) {
                return false
            }
        }
    }
    if(inCheck(game)) {
        return { result: !game.whitesMove ? "White" : "Black", reason: "Checkmate" }
    }
    return { result: "Stalemate", reason: "No more moves" }
}

function threeFoldRepetition(game) {
    const newChessGame = createGame(game.export[0])
    const positions = []
    game.export.slice(1).forEach((UCI) => {
        const startSquare = convertNotationtoLocation(UCI.substring(0, 2).toLowerCase())
        const endSquare = convertNotationtoLocation(UCI.substring(2, 4).toLowerCase())
        const promotion = UCI.substring(4, 5)
        const pieces = {
            "q": "queen",
            "r": "rook",
            "n": "knight",
            "b": "bishop"
        }
        newChessGame.board[startSquare[0]][startSquare[1]].move(endSquare[0], endSquare[1], promotion ? pieces[promotion.toLowerCase()] : false)
        positions.push(gametoFEN(newChessGame).split(" ")[0])
    })
    let numberOfPositions = 0
    positions.forEach(position => {
        const totalCurrentPos = positions.filter(pos => pos === position).length
        if(totalCurrentPos >= numberOfPositions) {
            numberOfPositions = totalCurrentPos
        }
    });
    return numberOfPositions >= 3
}

export default function createPiece(piece, isWhite, xPos, yPos, game) {
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
