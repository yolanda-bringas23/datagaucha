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

function register(request, callback){
    const formData = new FormData();

    formData.append("name", request.name)
    formData.append("userName", request.userName)
    formData.append("password", request.password)
    formData.append("dateBirth", request.dateBirth)

    if(request.file){
        formData.append("file", request.file)
    }

    pedido("user", "POST", formData, (payload) => {
        const response = new createUserResponse(payload)
        callback(response)
    })
}


function getUsers({ currentPage, pageSize, search }, callback) {
    const params = new URLSearchParams({ currentPage, pageSize });
    
    // Si hay una búsqueda real, la agregamos. Si está vacía, NO la mandamos.
    if (search && search.trim() !== "") {
        params.append("search", search.trim());
    }

    pedido(`user?${params.toString()}`, "GET", null, (payload) => {
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