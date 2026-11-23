/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function createBan(request, callback) {
    pedido("ban", "POST", request, (payload) => callback(new Ban(payload)));
}