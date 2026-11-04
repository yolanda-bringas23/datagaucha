/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function login(request, callback) {
    pedido("user/login", "POST", request, (payload) => {
        const response = new LoginResponse(payload);
        localStorage.setItem("token", response.token);
        saveCurrentUser(response);
        callback(response);
    });
}

function getUsers({ currentPage, pageSize, search }, callback) {
    const q = new URLSearchParams({ currentPage, pageSize, search: search ?? "" }).toString();

    pedido(`user?${q}`, "GET", null, (payload) => {
        callback((payload ?? []).map((u) => new User(u)));
    });
}

function saveCurrentUser(user) {
    const saved = getCurrentUser() ?? {};
    const merged = {
        id: user.id ?? saved.id,
        userName: user.userName ?? saved.userName,
        name: user.fullName ?? user.name ?? saved.name,
        avatarUrl: user.avatarUrl ?? user.urlAvatar ?? user.avatar ?? saved.avatarUrl
    };
    localStorage.setItem("user", JSON.stringify(merged));
}

function getCurrentUser() {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}