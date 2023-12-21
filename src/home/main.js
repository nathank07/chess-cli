import './home.css'
import newGame, { existingGame } from "../game/websockets.js"
import { changePlayerSide } from "../chess/modify.js"

const idList = convertIDList(document.body.getAttribute('idlist'))
console.log(idList)

idList.forEach(async id => {
    const game = await existingGame(id)
    const parent = document.createElement('a')
    const players = document.createElement('div')
    const whiteTimer = document.createElement('div')
    const blackTimer = document.createElement('div')
    whiteTimer.setAttribute('gameId', id)
    blackTimer.setAttribute('gameId', id)  
    whiteTimer.id = 'whiteTimer'
    blackTimer.id = 'blackTimer'
    players.classList.add('preview-players')
    players.appendChild(game.whiteUserSpan)
    const vs = document.createElement('span')
    vs.textContent = " vs "
    players.appendChild(vs)
    players.appendChild(game.blackUserSpan)
    parent.appendChild(players)
    parent.appendChild(game.div)
    parent.appendChild(whiteTimer)
    parent.appendChild(blackTimer)
    parent.setAttribute('id', id)
    parent.href = window.location.href + id
    changePlayerSide(game, true)
    document.querySelector('#game-list').appendChild(parent)
});


document.querySelector("#create-game").addEventListener('click', () => {
    newGame(false)
        .then(game => {
            window.location.href += `${game.id}`
        })
        .catch(error => {
            console.log(error)
        })
})

function convertIDList(idList) {
    if (idList === "") {
        return []
    }
    idList = idList.substring(1, idList.length - 1)
    return idList.split(' ')
}
