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

function getFollowers(userId, callback) {
    getFollowList(userId, "followers", callback);
}

function getFollowing(userId, callback) {
    getFollowList(userId, "following", callback);
}

function getFollowList(userId, list, callback) {
    const users = [];
    const pageSize = 50;

    function getPage(currentPage) {
        pedido(`follow/${userId}/${list}?currentPage=${currentPage}&pageSize=${pageSize}`, "GET", null, (payload) => {
            users.push(...payload.map(user => new User(user)));

            if (payload.length === pageSize) {
                getPage(currentPage + 1);
            } else {
                callback(users);
            }
        });
    }

    getPage(1);
}
