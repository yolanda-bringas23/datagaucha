/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

class LoginResponse {
    constructor(element) {
        const { id, userName, urlAvatar, token } = element;
        this.id = id;
        this.userName = userName;
        this.urlAvatar = urlAvatar;
        this.token = token;
    }
}