/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

function follow(userId, callback) {
    pedido(`follow/${userId}`, "POST", null, (payload) => callback(new User(payload)));
}

function unfollow(userId, callback) {
    pedido(`follow/${userId}`, "DELETE", null, () => callback());
}

function toggleFollow(userId, isFollowingNow, callback) {
    isFollowingNow
        ? unfollow(userId, () => callback({ isFollowing: false, userId }))
        : follow(userId, (user) => callback({ isFollowing: true, userId, target: user }));
}