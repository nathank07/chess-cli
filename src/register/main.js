import "../header/header.css"
import "../footer/footer.css"
import "../landing/landing.css"
import "./register.css"

document.querySelector('main form').onsubmit = (async (e) => {
    e.preventDefault()
    const form = validateForm()
    if(!form) { return }
    const formData = new URLSearchParams({
        username: form.username,
        password: form.password,
        confirm: form.confirm
    })
    const response = await fetch('/register', {
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

function validateForm() {
    const username = document.querySelector("form #username").value
    const usernameRegex = /^(?!.*[ ]{2,})(?!^[ ]|[ ]$)([a-zA-Z0-9_ -]{2,16})$/
    if(!usernameRegex.test(username)){
        alert("Invalid username\n\nUsername Requirements:\n2-16 Characters\nAlphanumeric, Space, Underscore, or Hyphen\nNo Consecutive Spaces\nNo Leading or Trailing Spaces\n")
        return false
    }
    const password = document.querySelector("form #password").value
    const confirm = document.querySelector("form #confirm").value
    if(password !== confirm) {
        alert("Passwords do not match.")
        return false
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[\s\S]{8,}$/
    if(!passwordRegex.test(password)){
        alert("Invalid password\n\nPassword Requirements:\n8 Characters\nAt least 1 capital letter\nAt least 1 number\n")
        return false
    }
    return {
        username: username,
        password: password,
        confirm: confirm
    };
}
