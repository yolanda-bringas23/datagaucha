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

    const nameComplete = data.name

    const nameCompleteFormat = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)+$/

    if(!nameCompleteFormat.test(nameComplete)){
        show(
            "Nombre incorrecto",
            "Tu nombre completo no debe contener caracteres especiales",
            "error"
        )
        return
    }

    if(nameComplete === ""){
        show(
            "Nombre inválido",
            "Ingresa tu nombre completo",
            "error"
        )
        return
    }

    if(data.userName === ""){
        show(
            "Nombre de usuario incorrecto",
            "Ingresa tu nombre de usuario",
            "error"
        )
        return
    }

    if(data.password === ""){
        show(
            "Contraseña incorrecta",
            "Debes introducir una contraseña valida",
            "error"
        )
        return
    }

    if(txtPasswordAgain.value === ""){
        show(
            "Contraseña incorrecta",
            "Debes ingresar nuevamente tu contraseña",
            "error"
        )
        return
    }

    if(data.password !== txtPasswordAgain.value){
        show(
            "Contraseña incorrecta",
            "Las contraseñas no coinciden",
            "error"
        )
        return
    }

    if(data.email === ""){
        show(
            "Email inválido",
            "Ingresá nuevamente tu email",
            "error"
        )
        return
    }

    if(data.day === "" || data.month === "" || data.year === ""){
        show(
            "Fecha de nacimiento inválida",
            "Debes ingresar tu fecha de nacimiento",
            "error"
        )
        return
    }

    if(termsCheck.checked === false){
        show(
            "¡Aviso!",
            "Acepta los terminos y condiciones",
            "warning"
        )
        return
    }

    if(ageCheck.checked === false){
        show(
            "¡Aviso!",
            "Confirma que eres mayor de 18 años",
            "warning"
        )
        return
    }

})
