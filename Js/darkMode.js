const boton = document.getElementById("darkMode")
let darkMode = localStorage.getItem("darkMode")
const body = document.getElementsByTagName("body")[0]

if(darkMode == "" || darkMode == 'undefined') mode = "dark"

if(darkMode === 'dark'){
    boton.innerText = "Modo oscuro"
    darkMode = 'light'
    body.classList.remove("light")
} else{
    boton.innerText = "Modo claro"
    darkMode = 'dark'
    body.classList.add("light")
}

boton.addEventListener("click", (evt) =>{
    if(darkMode === 'dark'){
        boton.innerText = "Modo claro"
        darkMode = 'light'
        body.classList.add("light")
    } else{
        boton.innerText = "Modo oscuro"
        darkMode = 'dark'
        body.classList.remove("light")
    }

    localStorage.setItem("darkMode", darkMode)
})