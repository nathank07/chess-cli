import './home.css'
import '../header/header.css'
import '../footer/footer.css'
import { changePlayerSide } from "../chess/modify.js"
import { createTimerDiv } from '../game/main.js'
import createLiveBoards from './livegames.js'
import linkDialog from './dialog.js'
import showCompleteList, { refresh } from './completegames.js'

const createGameDialog = document.querySelector('dialog')
linkDialog(createGameDialog)
const history = document.querySelector('.history')
history.firstElementChild.addEventListener('click', () => {
    history.lastElementChild.classList.toggle('disabled')
    const dropDownArrow = history.firstElementChild.lastElementChild
    dropDownArrow.classList.toggle('rotate')
})

const refreshButton = history.querySelector("#refresh")    
const filter = history.querySelector(".switch > input")
const amount = history.querySelector(".radio-container > .tabs");

function checkRadio(radio) {
    const checkBox = radio.querySelector('input[type="radio"]:checked')
    const value = document.querySelector(`label[for="${checkBox.id}"]`).textContent
    return value
}

async function loadGames() {
    const usernameSpan = document.querySelector('#user-dropdown > span');
    const username = usernameSpan ? usernameSpan.textContent : false
    const live = document.querySelector('#game-list')
    const finished = document.querySelector('#game-history-list')
    createLiveBoards(live)
    showCompleteList(finished, filter.checked ? username : false, amount ? checkRadio(amount) : 100)  
    refreshButton.addEventListener('click', () => {
        refresh(finished, filter.checked ? username : false, amount ? checkRadio(amount) : 100)
    })
} 

loadGames()