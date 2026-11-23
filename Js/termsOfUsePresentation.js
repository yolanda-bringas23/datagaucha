/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const btnBack = document.getElementById("btnBack");

if (btnBack) {
    const urlParam = new URLSearchParams(window.location.search);
    const urlCallback = urlParam.get("urlCallback");

    btnBack.addEventListener("click", () => {
        if (urlCallback) {
            window.location.href = urlCallback;
        } else {
            window.history.back();
        }
    });
}