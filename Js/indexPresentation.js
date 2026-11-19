/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const muro = document.getElementById("section")

const posts = getPost();

for(let post of posts) {
    const p = new Post(post)
    muro.innerHTML += p.getPostPresentation()
}