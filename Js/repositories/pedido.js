/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const BACKEND_HOST = "http://localhost:5033/";
const BASE_URL = BACKEND_HOST + "api/";

function pedido(ruta, metodo, body, callback) {
    const token = localStorage.getItem("token");

    const opciones = {
        method: metodo,
        headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
    };

    // Si es FormData (como las imágenes), no seteamos Content-Type
    if (body instanceof FormData) {
        opciones.body = body;
    } else if (body) {
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify(body);
    }

    return fetch(BASE_URL + ruta, opciones)
        .then(async (res) => {
            const texto = await res.text(); // Leemos el texto primero
            
            if (!texto) {
                throw new Error("El servidor devolvió una respuesta vacía. (Código " + res.status + ")");
            }

            let json;
            try {
                json = JSON.parse(texto); // Intentamos convertir a JSON
            } catch (e) {
                throw new Error("El servidor no devolvió un JSON válido. (Código " + res.status + ")");
            }

            if (json.success) {
                callback(json.payload);
            } else {
                show("Error", json.message || "Error desconocido", "error");
            }
        })
        .catch((err) => {
            show("Error de red", err.message, "error");
        });
}
