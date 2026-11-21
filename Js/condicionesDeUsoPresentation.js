/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const btnBack = document.getElementById("btnBack")

const urlParam = new URLSearchParams(window.location.search)
const urlCallback = urlParam.get('urlCallback')

btnBack.addEventListener("click", () =>{
    window.location = `${urlCallback}`
})