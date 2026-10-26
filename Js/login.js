const loginForm = document.getElementById("login-form")
const txtUser = document.getElementById("usuario")
const txtPassword = document.getElementById("password")

loginForm.addEventListener("submit", (eventInformation) =>{
    eventInformation.preventDefault();

    const data = {
        userName : txtUser.value,
        password : txtPassword.value
    }

    if(data.userName === ""){
        alert("Ingresá tu usuario o correo")
        return
    }

    if(data.password === ""){
        alert("Ingresá tu contraseña")
        return
    }

})
