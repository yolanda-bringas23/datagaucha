/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function getPosts({ currentPage, pageSize, orderBy = "createdAt", orderDirection = "desc", search = "" }, callback) {
    // Armamos la base de la URL
    const params = new URLSearchParams({ currentPage, pageSize, orderBy, orderDirection });
    
    // Solo agregamos 'search' si realmente hay algo escrito
    const searchValue = search ? search.trim() : "";
    if (searchValue) {
        params.append("search", searchValue);
    }

    pedido(`post?${params.toString()}`, "GET", null, (payload) => {
        callback((payload ?? []).map((p) => new Post(p)));
    });
}

function createPost(formData, callback) {
    pedido("post", "POST", formData, (payload) => callback(new Post(payload)));
}

function deletePost(id, callback) {
    pedido(`post/${id}`, "DELETE", null, () => callback());
}