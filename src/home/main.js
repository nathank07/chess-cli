import './home.css'
import newGame, { existingGame } from "../game/websockets.js"
import { changePlayerSide } from "../chess/modify.js"

const idList = convertIDList(document.body.getAttribute('idlist'))
console.log(idList)

idList.forEach(async id => {
    const game = await existingGame(id)
    const parent = document.createElement('div')
    parent.appendChild(game.div)
    parent.setAttribute('id', id)
    parent.addEventListener('click', () => {
        window.location.href += id 
    })
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
