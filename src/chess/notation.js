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
    return [Number(notation[1].toLowerCase()) - 1, file[notation[0]]]
}

export function lastMoveToNotation(game, prevBoard) {
    const initialSq = game.lastMove[0]
    const finalSq = game.lastMove[1]
    const ixy = convertNotationtoLocation(initialSq)
    const fxy = convertNotationtoLocation(finalSq)
    const prevPiece = prevBoard[ixy[0]][ixy[1]].name;
    const finalPiece = game.board[fxy[0]][fxy[1]].name;
    const take = prevBoard[fxy[0]][fxy[1]] !== null ? "x" : "";
    const check = wasCheckOrMate(game, prevBoard);
    const contextSquare = checkRowsAndColumns(game, prevBoard, initialSq, finalSq, finalPiece);
    const promotion = prevPiece !== finalPiece
    const specialCase = wasSpecialCase(initialSq, finalSq, prevPiece, finalPiece, take, check, promotion);
    if(specialCase) {
        return specialCase
    }
    const charPiece = finalPiece === "knight" ? "N" : finalPiece[0].toUpperCase();
    return `${charPiece}${contextSquare}${take}${finalSq}${check}`
}

function checkRowsAndColumns(game, prevBoard, initialSq, finalSq, finalPiece) {
    const oldBoard = prevBoard
    let xy = convertNotationtoLocation(initialSq)
    const initX = xy[0]
    const initY = xy[1]
    xy = convertNotationtoLocation(finalSq)
    const finalX = xy[0]
    const finalY = xy[1]
    const isWhite = game.board[finalX][finalY].isWhite
    let columnFlag = false;
    let rowFlag = false;
    for(let i = 0; i < 8; i++) {
        if(oldBoard[initX][i] && oldBoard[initX][i].isWhite === isWhite 
            && oldBoard[initX][i].name === finalPiece && i !== initY) {
            if(stdMovesHasSquare(game.board[initX][i].standardMoves(), finalX, finalY)) {
                columnFlag = true;
            }
        }
        if(oldBoard[i][initY] && oldBoard[i][initY].isWhite === isWhite 
            && oldBoard[i][initY].name === finalPiece && i !== initX) {
            if(stdMovesHasSquare(game.board[i][initY].standardMoves(), finalX, finalY)) {
                rowFlag = true;
                break;
            }
        }
    }
    return `${columnFlag ? initialSq[0] : ""}${rowFlag ? initialSq[1] : ""}`
}

function stdMovesHasSquare(stdMoves, finalX, finalY) {
    for(const move of stdMoves) {
        if(move[0] === finalX && move[1] === finalY) {
            return true;
        }
    }
    return false;
}

function wasSpecialCase(initialSq, finalSq, prevPiece, finalPiece, take, check) {
    if(wasCastle(finalPiece, initialSq, finalSq)) {
        return wasCastle(finalPiece, initialSq, finalSq) + check;
    }
    if(finalPiece === "pawn") {
        return take ? `${initialSq[0]}x${finalSq}${check}` : `${finalSq}${check}`
    }
    if(prevPiece !== finalPiece) {
        if(take) {
            return `${prevPiece[0]}x${finalSq}${check}`
        } else {
            return finalSq + check
        }
    }
}

function wasCastle(finalPiece, initialSq, finalSq) {
    if(finalPiece === "king" && initialSq[0] === "e") {
        if(finalSq[0] === "g") {
            return "O-O"
        }
        if(finalSq[0] === "c") {
            return "O-O-O"
        }
    }
    return false;
}

function wasCheckOrMate(game, prevBoard) {
    if(game.lastMoveSound === "check") {
        if(!game.result) {
            return "+"
        }
        if(game.result.reason === "Checkmate" && compareBoards(game.history[game.history.length - 1].board, prevBoard)) {
            return "#"
        }
    }
    return ""
}

function compareBoards(board1, board2) {
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(board1[i][j] && !board2[i][j]) {
                return false;
            }
            if(!board1[i][j] && board2[i][j]) {
                return false;
            }
            if(board1[i][j] !== board2[i][j]) {
                return false;
            }
        }
    }
    return true;
}


