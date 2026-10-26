const registerForm = document.getElementById("register-form")
const txtName = document.getElementById("NameInput")
const txtUser = document.getElementById("nameUser-register")
const txtPassword = document.getElementById("password-register")
const txtPasswordAgain = document.getElementById("Password-again")
const txtEmail = document.getElementById("Email-register")
const txtDay = document.getElementById("day-register")
const txtMonth = document.getElementById("month-register")
const txtYear = document.getElementById("year-register")
const termsCheck = document.getElementById("terms-check")
const ageCheck = document.getElementById("age-check")

registerForm.addEventListener("submit", (eventInformation) =>{
    eventInformation.preventDefault();

    const data = {
        name : txtName.value,
        userName : txtUser.value,
        password : txtPassword.value,
        email : txtEmail.value,
        day : txtDay.value,
        month : txtMonth.value,
        year : txtYear.value
    }

    if(data.name === ""){
        alert("Ingresa tu nombre completo")
        return
    }

    if(data.userName === ""){
        alert("Ingresá tu nombre de usuario")
        return
    }

    if(data.password === ""){
        alert("Ingresá tu contraseña")
        return
    }

    if(txtPasswordAgain.value === ""){
        alert("volve a poner tu contraseña")
        return
    }

    if(data.password !== txtPasswordAgain.value){
        alert("Las contraseñas no coinciden")
        return
    }

    if(data.email === ""){
        alert("Ingresá tu email")
        return
    }

    if(data.day === "" || data.month === "" || data.year === ""){
        alert("Completa tu fecha de nacimiento")
        return
    }

    if(termsCheck.checked === false){
        alert("Aceptá los terminos y condiciones!")
        return
    }

    if(ageCheck.checked === false){
        alert("confirma que eres mayor de 18 años")
        return
    }

})
