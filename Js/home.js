/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function getHomeSearch() {
    return (new URLSearchParams(window.location.search).get("search") ?? "").trim();
}

function loadHomePosts(page, callback) {
    getPosts({
        currentPage: page,
        pageSize: PAGE_SIZE,
        orderBy: "createdAt",
        orderDirection: "desc",
        search: getHomeSearch()
    }, callback);
}

function reactToPost(postId, type, callback) {
    setReaction(postId, type, callback);
}

function createHomePost(formData, callback) {
    createPost(formData, callback);
}

function getHomeCurrentUser() {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
}