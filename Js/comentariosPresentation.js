const autorPublicacion = document.getElementById("autorPublicacion");

const avisoComentarios = new Toast("avisoComentarios");

const yo = getCurrentUser();
const publicacion = getPost()[0];

function buscarAutor(userName) {
    const porNombreActual = getUserByUserName(userName);
    if (porNombreActual) return porNombreActual;

    const buscado = String(userName).toLowerCase();

    return getUsers().find(usuario =>
        getUserAliases(usuario).some(alias => alias.toLowerCase() === buscado)
    ) || null;
}

const autor = buscarAutor(publicacion.userName);
const esMiPublicacion = autor ? autor.id === yo.id : false;

function renderAutor() {
    if (!autor) {
        autorPublicacion.innerHTML = `<p class="p-index">${User.escape(publicacion.userName)}</p>`;
        return;
    }

    const persona = getUserById(autor.id) || autor;
    const loSigo = isFollowing(persona.id);

    autorPublicacion.innerHTML = new User(persona)
        .getAuthorPresentation(loSigo, !esMiPublicacion);
}

document.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-action='toggle']");
    if (!boton) return;

    const id = parseInt(boton.dataset.userId);
    const resultado = toggleFollow(id);
    if (!resultado) return;

    renderAutor();

    avisoComentarios.mostrar(resultado.isFollowing
        ? `Ahora seguís a ${resultado.target.fullName}`
        : `Dejaste de seguir a ${resultado.target.fullName}`);
});

const nombreEnHeader = document.querySelector(".text-profile");
if (nombreEnHeader) nombreEnHeader.innerText = yo.fullName;

renderAutor();

const commentForm = document.getElementById("comment-write")
const txtComment =  document.getElementById("txt-comment")
const commentsList = document.getElementById("comments-list")

commentForm.addEventListener("submit", (eventInformation) =>{
    eventInformation.preventDefault();

    if (txtComment.value == "" || null) {
        alert("Escribe un comentario antes de publicar!")
        return
    }

    const comment = document.createElement("div")
    comment.className = "User-comment"

    const commentHeader = document.createElement("div")
    commentHeader.className = "user-comment-header"

    const userIcon = document.createElement("i")
    userIcon.className = "fa-solid fa-circle-user comment-icon"

    const userName = document.createElement("p")
    userName.className = "comment-username"
    userName.innerText = "Nombre de usuario"

    const commentText = document.createElement("p")
    commentText.className = "comment-text"
    commentText.innerText = txtComment.value

    commentHeader.append(userIcon)
    commentHeader.append(userName)
    comment.append(commentHeader)
    comment.append(commentText)
    commentsList.append(comment)

    txtComment.value = ""
    txtComment.focus()
})

