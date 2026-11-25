/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function getProfile(callback) {
    pedido("user/profile", "GET", null, (payload) => {
        saveCurrentUser(payload);
        callback(new User(payload));
    });
}

function updateProfile(request, callback) {
    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("userName", request.userName);

    if (request.password) {
        formData.append("password", request.password);
    }

    if (request.file) {
        formData.append("file", request.file);
    }

    return pedido("user/profile", "PUT", formData, (payload) => {
        saveCurrentUser(payload);
        callback(new User(payload));
    });
}
