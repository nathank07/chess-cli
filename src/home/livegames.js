import newGame, { existingGame } from "../game/websockets"
import { changePlayerSide } from "../chess/modify.js"
import { createTimerDiv } from '../game/main.js'

export default async function createLiveBoards(divHolder) {
    const gameIDs = await getLiveIDs() 
    if(gameIDs.length === 0) {
        divHolder.replaceWith(createLiveEmpty())
        return
    }
    const games = await Promise.all(gameIDs.map(async (gameID) => {
        const parent = document.createElement('a')
        const whiteTimer = document.createElement('div')
        const blackTimer = document.createElement('div')
        whiteTimer.setAttribute('gameid', gameID) 
        blackTimer.setAttribute('gameid', gameID)
        whiteTimer.id = 'whiteTimer'
        blackTimer.id = 'blackTimer'
        let game;
        try {
            game = await getLive(gameID, parent, () => {
                createTimerDiv(game, true, whiteTimer)
                createTimerDiv(game, false, blackTimer)
            })
        } catch (e){
            console.log(e)
        }
        const top = document.createElement('div')
        const bottom = document.createElement('div')
        top.ariaLabel = "Black Player"
        bottom.ariaLabel = "White Player"

        top.appendChild(game.blackUserSpan)
        top.appendChild(blackTimer)
        bottom.appendChild(game.whiteUserSpan)
        bottom.appendChild(whiteTimer)

        parent.appendChild(top)
        parent.appendChild(game.div)
        parent.appendChild(bottom)
        
        parent.setAttribute('id', gameID)
        parent.href = `${window.location.origin}/game/${gameID}`
        changePlayerSide(game, true)
        if(game.whiteClock && game.blackClock) {
            createTimerDiv(game, true, whiteTimer)
            createTimerDiv(game, false, blackTimer)
        }
        return parent;
    })).catch(e => console.log(e));
    games.forEach(game => {
        divHolder.appendChild(game)
    });
    const newGameButton = document.createElement('button')
    const createGameDialog = document.querySelector('dialog')
    const dialogDiv = createGameDialog.firstElementChild
    newGameButton.innerHTML = '<i class="material-symbols-outlined">add</i>\nNew Game';
    newGameButton.addEventListener('click', () => {
        createGameDialog.showModal()
        document.addEventListener('click', function close(e) {
            if(!checkParent(e.target, dialogDiv) && e.target !== newGameButton && e.target !== newGameButton.firstElementChild) {
                createGameDialog.close()
                document.removeEventListener('click', close)
            }
        })
    })
    document.querySelector('.empty').remove()
    divHolder.appendChild(newGameButton)
}


function getLiveIDs() {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch('/api/game/live', { cache: "no-cache" })
            const games = await res.json()
            if(!games) {
                resolve([])
                return
            }
            resolve(games)
        }
        catch (e) {
            reject(e)
        }
    })
}

function getLive(gameID, divHolder, updateFunction) {
    return new Promise(async (resolve, reject) => {
        try {
            const importedGame = await existingGame(gameID, divHolder, updateFunction)
            resolve(importedGame)
        }
        catch (e) {
            reject(e)
        }
    })
}

function createLiveEmpty() {
    const messageContainer = document.createElement('div')

    const message = document.createElement('h2')
    message.textContent = "No Live Games"
    const emoji = document.createElement('div')
    emoji.textContent = "😢"
    emoji.classList.add('large-emoji')

    const createGameButton = document.createElement('button')
    const createGameDialog = document.querySelector('dialog')
    const dialogDiv = createGameDialog.firstElementChild
    createGameButton.textContent = "Create a New Game"
    createGameButton.id = "create-game"
    createGameButton.addEventListener('click', () => {
        createGameDialog.showModal()
        document.addEventListener('click', function close(e) {
            if(!checkParent(e.target, dialogDiv) && e.target !== createGameButton) {
                createGameDialog.close()
                document.removeEventListener('click', close)
            }
        })
    })
    messageContainer.appendChild(emoji)
    messageContainer.appendChild(message)
    messageContainer.appendChild(createGameButton)
    messageContainer.id = "no-games"
    
    return messageContainer
}

function checkParent(target, parent) {
    if (target === parent) {
        return true;
    }
    if (target.parentElement) {
        return checkParent(target.parentElement, parent);
    }
    return false;
}