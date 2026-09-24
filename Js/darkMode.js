const boton = document.getElementById("darkMode")
let darkMode = localStorage.getItem("darkMode")
const body = document.getElementsByTagName("body")[0]

if(darkMode == null || darkMode == 'undefined') {
    darkMode = "dark"
}

if(darkMode === 'dark'){
    boton.innerHTML = '<i class="bi bi-moon-fill"></i> <span>Modo oscuro</span>'
    darkMode = 'light'
    body.classList.remove("light")
} else{
    boton.innerHTML = '<i class="bi bi-sun-fill"></i> <span>Modo claro</span>'
    darkMode = 'dark'
    body.classList.add("light")
}

boton.addEventListener("click", (evt) =>{
    if(darkMode === 'dark'){
        boton.innerHTML = '<i class="bi bi-sun-fill"></i> <span>Modo claro</span>'
        darkMode = 'light'
        body.classList.add("light")
    } else{
        boton.innerHTML = '<i class="bi bi-moon-fill"></i> <span>Modo oscuro</span>'
        darkMode = 'dark'
        body.classList.remove("light")
    }

    localStorage.setItem("darkMode", darkMode)
})