export default function randomMove(game, isWhite) {
    const possibleMoves = []
    game.board.forEach(row => {
        row.forEach(piece => {
            if(piece && piece.isWhite === isWhite) {
                piece.moves().forEach(move => {
                   possibleMoves.push([[piece.xPos, piece.yPos], move])
                });
            }
        });
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(possibleMoves.length ? possibleMoves[Math.floor(Math.random() * possibleMoves.length)] : false)
        }, 1000)
    })
}