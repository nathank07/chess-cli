export default function randomMove(game, isWhite) {
    const possibleMoves = []
    game.board.forEach((row, x) => {
        row.forEach((piece, y) => {
            if(piece && piece.isWhite === isWhite) {
                piece.moves().forEach(move => {
                   possibleMoves.push([[piece.xPos, piece.yPos], move])
                });
            }
        });
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(possibleMoves[Math.floor(Math.random() * possibleMoves.length )])
        }, 1000)
    })
}