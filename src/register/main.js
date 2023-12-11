import "./register.css"

function validateForm() {
    const password = document.querySelector("form #password").value
    const confirm = document.querySelector("form #confirm").value
    if(password != confirm) {
        alert("Passwords do not match.")
    }
    return password == confirm
}

document.querySelector('form').onsubmit = validateForm
