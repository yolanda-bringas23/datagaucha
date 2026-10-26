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
