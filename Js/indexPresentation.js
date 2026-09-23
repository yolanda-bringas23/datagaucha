const muro = document.getElementById("section")

const posts = getPost();

for(let post of posts) {
    const p = new Post(post)
    muro.innerHTML += p.getPostPresentation()
}