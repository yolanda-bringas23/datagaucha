/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const BASE_URL = "http://localhost:5033/api/";
const BACKEND_HOST = "http://localhost:5033/";

function mostrarErrorPedido(titulo, mensaje, tipo = "error") {
    if (typeof show === "function") {
        show(titulo, mensaje, tipo);
    } else {
        console.error(`${titulo}: ${mensaje}`);
    }
}

function pedido(ruta, metodo, body, callback) {
    const token = localStorage.getItem("token");

    const opciones = {
        method: metodo,
        headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
    };

<<<<<<< HEAD:Js/repositories/pedido.js
    // Si es FormData, dejamos que fetch establezca Content-Type.
=======
>>>>>>> 73236046b084d5b720af04ba82acbbca4022bf9f:Js/repositories/pedidoRepositories.js
    if (body instanceof FormData) {
        opciones.body = body;
    } else if (body) {
        opciones.headers["Content-Type"] = "application/json";
        opciones.body = JSON.stringify(body);
    }

    fetch(BASE_URL + ruta, opciones)
        .then(async (res) => {
            const texto = await res.text();

            if (!texto) {
                throw new Error(
                    "El servidor devolvió una respuesta vacía. (Código " + res.status + ")"
                );
            }

            let json;

            try {
                json = JSON.parse(texto);
<<<<<<< HEAD:Js/repositories/pedido.js
            } catch (error) {
                throw new Error(
                    "El servidor no devolvió un JSON válido. (Código " + res.status + ")"
                );
=======
            } catch (e) {
                throw new Error("El servidor no devolvió un JSON válido. (Código " + res.status + ")");
>>>>>>> 73236046b084d5b720af04ba82acbbca4022bf9f:Js/repositories/pedidoRepositories.js
            }

            if (!res.ok || !json.success) {
                show("Error", json.message || "Error desconocido", "error");
                return;
            }

            callback(json.payload);
        })
        .catch((err) => {
            mostrarErrorPedido("Error de red", err.message, "error");
        });
}