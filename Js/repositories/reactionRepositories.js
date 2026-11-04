/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function setReaction(postId, type, callback) {
    pedido("reaction", "POST", { postId, type }, () => callback());
}

function deleteReaction(postId, callback) {
    pedido(`reaction/${postId}`, "DELETE", null, () => callback());
}