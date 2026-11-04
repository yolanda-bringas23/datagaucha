const loginForm = document.getElementById("login-form")
const txtUser = document.getElementById("usuario")
const txtPassword = document.getElementById("password")

loginForm.addEventListener("submit", async (eventInformation) =>{
    eventInformation.preventDefault();

    const API_URL = "http://localhost:5033/api"

    const data = {
        userName : txtUser.value.trim(),
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

    try {
        const response = await fetch (`${API_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()

        console.log("Respuesta del backend:", result)
        console.log("Payload:", result.payload)
        console.log("Token recibido:", result.payload?.token)
        console.log("Token guardado:", localStorage.getItem("token"));
        console.log("Usuario guardado:", localStorage.getItem("user"));

        if(!response.ok || !result.success){
            alert(result.message || "Usuario o clave incorrectos")
            return
        }

        try {
            localStorage.setItem("token", result.payload.token);
        } catch (error) {
            console.error("Error iniciando sesion:", error);
        }

        localStorage.setItem("token", result.payload.token)
        localStorage.setItem("user", JSON.stringify(result.payload))

        window.location.href = "../index.html"

    } catch(error){
        console.error("Error al iniciar sesion:", error)
        alert("No se pudo conectar con el servidor. Por favor intente nuevamente")
    }

})