const btnBack = document.getElementById("btnBack")

const urlParam = new URLSearchParams(window.location.search)
const urlCallback = urlParam.get('urlCallback')

btnBack.addEventListener("click", () =>{
    window.location = `${urlCallback}`
})