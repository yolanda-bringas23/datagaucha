/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const BASE_URL = "https://localhost:5001/api/";

function pedido(ruta, metodo, body, callback) {
    const token = localStorage.getItem("token");

    const opciones = {
        method: metodo,
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
    };

    if (body instanceof FormData) {
        opciones.body = body;
    } else if (body != null) {
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify(body);
    }

    fetch(BASE_URL + ruta, opciones)
        .then(async (res) => {
            const json = await res.json();
            if (json.success) {
                callback(json.payload);
            } else {
                show("Error", json.message ?? "Unknown error", "error");
            }
        })
        .catch((err) => {
            show("Network error", err.message, "error");
        });
}