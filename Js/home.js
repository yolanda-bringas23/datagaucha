/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function obtenerSearchHome() {
    return (new URLSearchParams(window.location.search).get("search") ?? "").trim();
}

function cargarPostsHome(page, callback) {
    getPosts({
        currentPage: page,
        pageSize: PAGE_SIZE,
        orderBy: "createdAt",
        orderDirection: "desc",
        search: obtenerSearchHome()
    }, callback);
}

function reaccionarPost(postId, type, callback) {
    setReaction(postId, type, callback);
}

function crearPostHome(formData, callback) {
    createPost(formData, callback);
}

function obtenerUsuarioActualHome() {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
}