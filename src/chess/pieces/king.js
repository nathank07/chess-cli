import createPiece, { Piece, outOfBounds, cloneBoard } from "./piece.js"

export default function King( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "king",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            const moves = []
            const canCastle = game.whiteState === undefined ? false : checkCastleLegality(isWhite, game)
            const castleState = isWhite ? game.whiteState : game.blackState
            const kingRow = isWhite ? 0 : 7
            for(let i = -1; i <= 1; i++) {
                const x = i + xPos
                for(let j = -1; j <= 1; j++) {
                    const y = j + yPos

                    if(outOfBounds(x, y)) { continue }

                    if(game.board[x][y] === null || piece.canCapture(game.board[x][y])) {
                        moves.push([x, y, () => {
                            castleState.longCastle = false
                            castleState.shortCastle = false
                        }])
                    }
                }
            }
            if(canCastle) {
                if(canCastle.short) {
                    moves.push([kingRow, 1, () => {
                        castleState.longCastle = false
                        castleState.shortCastle = false
                        game.board[kingRow][0] = null
                        createPiece("rook", isWhite, kingRow, 2, game)
                    }])
                }
                if(canCastle.long) {
                    moves.push([kingRow, 5, () => {
                        castleState.longCastle = false
                        castleState.shortCastle = false
                        game.board[kingRow][7] = null
                        createPiece("rook", isWhite, kingRow, 4, game)
                    }])
                }
            }
            return moves
        },

    })

    piece.inCheck = () => {
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(game.board[i][j] && game.board[i][j].standardMoves().some(pos => pos[0] === xPos && pos[1] === yPos)) {
                    return true
                }
            }
        }
        return false
    }

    return piece;
}

function checkCastleLegality(isWhite, game) {
    const castleState = isWhite ? game.whiteState : game.blackState
    const kingRow = isWhite ? 0 : 7
    let kingSquare
    if(castleState === undefined || !castleState.shortCastle && !castleState.longCastle) {
        return false
    }
    // Get all of the moves here instead of isLegal because these don't have to be legal captures
    const moves = []
    const boardClone = cloneBoard(game.board)
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(game.board[i][j]) {
                if(game.board[i][j].isWhite === !isWhite) {
                    boardClone[i][j].standardMoves().map(move => moves.push(move))
                }
                if(game.board[i][j].name === "king" && game.board[i][j].isWhite === isWhite){
                    if(boardClone[i][j].inCheck()) {
                        return false;
                    }
                }         
            }   
        }
    }
    let short = true
    let long = true
    if(castleState.shortCastle) {
        if(moves.some(move => move[0] === kingRow && move[1] === 2) 
        || moves.some(move => move[0] === kingRow && move[1] === 1)) {
            short = false
        }
    }
    if(castleState.longCastle) {
        if(moves.some(move => move[0] === kingRow && move[1] === 4) 
        || moves.some(move => move[0] === kingRow && move[1] === 5)) {
            long = false
        }
    }
    return {short, long}
}