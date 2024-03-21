import "../landing/landing.css"
import "../header/header.css"
import "../footer/footer.css"
import "../register/register.css"
import './login.css'

const form = document.querySelector('main form')
form.onsubmit = (async (e) => {
    e.preventDefault()
    const username = form.querySelector('#username').value
    const password = form.querySelector('#password').value
    const formData = new URLSearchParams({
        username: username,
        password: password
    })
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    if(response.status === 200) {
        window.location.href = '/home'
    } else {
        const reasonFailed = await response.json()
        alert(reasonFailed.status)
    }
})
