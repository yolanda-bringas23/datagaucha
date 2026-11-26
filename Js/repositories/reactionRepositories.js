/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function setReaction(postId, type, callback) {
    const id = parseInt(postId);
    // El backend espera el enum como número: Like = 0, Dislike = 1
    const tipoNumerico = type === "Like" ? 0 : 1;
    
    pedido("reaction", "POST", { postId: id, type: tipoNumerico }, () => callback());
}

function deleteReaction(postId, callback) {
    const id = parseInt(postId);
    pedido(`reaction/${id}`, "DELETE", null, () => callback());
}