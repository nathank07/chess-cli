import "../header/header.css"
import "../footer/footer.css"
import "../landing/landing.css"
import "./register.css"

function validateForm() {
    const username = document.querySelector("form #username").value
    const usernameRegex = /^(?!.*[ ]{2,})(?!^[ ]|[ ]$)([a-zA-Z0-9_ -]{2,16})$/
    if(!usernameRegex.test(username)){
        alert("Invalid username\n\nUsername Requirements:\n2-16 Characters\nAlphanumeric, Space, Underscore, or Hyphen\nNo Consecutive Spaces\nNo Leading or Trailing Spaces\n")
        return false
    }
    const password = document.querySelector("form #password").value
    const confirm = document.querySelector("form #confirm").value
    if(password != confirm) {
        alert("Passwords do not match.")
        return false
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[\s\S]{8,}$/
    if(!passwordRegex.test(password)){
        alert("Invalid password\n\nPassword Requirements:\n8 Characters\nAt least 1 Letter\nAt least 1 Number\n")
        return false
    }
    return true;
}

document.querySelector('main form').onsubmit = validateForm