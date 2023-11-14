import { Piece, outOfBounds } from "./piece.js"

export default function Rook( { isWhite, xPos, yPos, game } ) {
    const piece = Piece({
        name: "rook",
        isWhite: isWhite,
        xPos: xPos,
        yPos: yPos,
        game: game,

        standardMoves: () => {
            const directions = [
                [1, 0],
                [-1, 0], 
                [0, 1], 
                [0, -1]  
              ];
            let moves = []
            for (const direction of directions) {
                let [dx, dy] = direction;
                let x = xPos + dx;
                let y = yPos + dy;
                while (!outOfBounds(x, y)) {
                    if (game.board[x][y] === null || piece.canCapture(game.board[x][y]) || game.board[x][y].name === "passant") {
                        moves.push([x, y, () => {
                            if(xPos === 0 && yPos === 0) { game.whiteState.shortCastle = false }
                            if(xPos === 0 && yPos === 7) { game.whiteState.longCastle = false }
                            if(xPos === 7 && yPos === 0) { game.blackState.shortCastle = false }
                            if(xPos === 7 && yPos === 7) { game.blackState.longCastle = false }
                        }]);
                        if (piece.canCapture(game.board[x][y]) && game.board[x][y].name !== "passant") {
                            break;
                        }
                    } else {
                        break;
                    }
                    x += dx;
                    y += dy;
                }
              }
              
            return moves
        }
    })

    return piece;
}