const perfilAvatar = document.getElementById("perfilAvatar");
const perfilInfo = document.getElementById("perfilInfo");
const perfilAcciones = document.getElementById("perfilAcciones");
const perfilPublicaciones = document.getElementById("perfilPublicaciones");
const tituloPublicaciones = document.getElementById("tituloPublicaciones");
const btnEditarPerfil = document.getElementById("btnEditarPerfil");

const btnSeguidores = document.getElementById("btnSeguidores");
const btnSeguidos = document.getElementById("btnSeguidos");
const listaSeguidores = document.getElementById("listaSeguidores");
const listaSeguidos = document.getElementById("listaSeguidos");
const listaComunidad = document.getElementById("listaComunidad");

const formEditarPerfil = document.getElementById("formEditarPerfil");
const inputAvatar = document.getElementById("inputAvatar");
const inputNombre = document.getElementById("inputNombre");
const inputUsuario = document.getElementById("inputUsuario");
const inputEmail = document.getElementById("inputEmail");
const inputBio = document.getElementById("inputBio");
const inputPassword = document.getElementById("inputPassword");

const PESO_MAXIMO_AVATAR = 1.5 * 1024 * 1024;

const parametros = new URLSearchParams(window.location.search);
const usuarioPedido = parametros.get("usuario");

const yo = getCurrentUser();
const perfilPedido = usuarioPedido ? getUserByUserName(usuarioPedido) : yo;

const perfil = perfilPedido || yo;
const esMiPerfil = perfil.id === yo.id;

const aviso = new Toast("avisoPerfil");

function mostrarAviso(texto, tipo = "ok") {
    aviso.mostrar(texto, tipo);
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (!modal || typeof bootstrap === "undefined") return;

    const instancia = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
    instancia.hide();
}

function renderPerfil() {
    const persona = getUserById(perfil.id) || perfil;
    const usuario = new User(persona);

    perfilAvatar.src = persona.avatar;
    perfilAvatar.alt = `Foto de perfil de ${persona.fullName}`;
    perfilInfo.innerHTML = usuario.getProfilePresentation();

    btnSeguidores.innerText = `${persona.followers.length} Seguidores`;
    btnSeguidos.innerText = `${persona.following.length} Siguiendo`;

    renderAcciones(persona);
    renderPublicaciones(persona);
    renderSeguidores(persona);
    renderSeguidos(persona);
    renderComunidad();
}

function renderAcciones(persona) {
    const usuario = new User(persona);

    if (esMiPerfil) {
        btnEditarPerfil.hidden = false;
        perfilAcciones.innerHTML = "";
        tituloPublicaciones.innerText = "Mis Publicaciones";
        return;
    }

    btnEditarPerfil.hidden = true;
    tituloPublicaciones.innerText = `Publicaciones de ${persona.fullName}`;

    const loSigo = isFollowing(persona.id);

    perfilAcciones.innerHTML = `
        ${usuario.getFollowButtonPresentation(loSigo)}
        <a class="link-volver" href="perfil.html">Volver a mi perfil</a>
    `;
}

function renderPublicaciones(persona) {
    const arreglarRuta = (url) => String(url || "").replace(/^\.\//, "../");

    const alias = getUserAliases(persona).map(nombre => nombre.toLowerCase());

    const publicaciones = getPost()
        .filter(post => alias.includes(String(post.userName).toLowerCase()))
        .map(post => ({ ...post, imageUrl: arreglarRuta(post.imageUrl) }));

    if (publicaciones.length === 0) {
        const mensaje = esMiPerfil
            ? "Todavía no publicaste nada."
            : "Esta persona todavía no tiene publicaciones.";
        perfilPublicaciones.innerHTML = `<p class="profile-empty">${mensaje}</p>`;
        return;
    }

    perfilPublicaciones.innerHTML = publicaciones
        .map(publicacion => new Post(publicacion).getPostPresentation())
        .join("")
        .replaceAll('href="html/comentarios.html"', 'href="comentarios.html"');
}

function renderSeguidores(persona) {
    const seguidores = getFollowers(persona);

    if (seguidores.length === 0) {
        listaSeguidores.innerHTML = `<p class="profile-empty">Todavía no tiene seguidores.</p>`;
        return;
    }

    listaSeguidores.innerHTML = seguidores
        .map(seguidor => {
            if (esMiPerfil) {
                return new User(seguidor).getProfileRowPresentation({
                    label: "Quitar",
                    type: "remove"
                });
            }

            return new User(seguidor).getProfileRowPresentation({
                label: isFollowing(seguidor.id) ? "Siguiendo" : "Seguir",
                type: "toggle",
                isFollowing: isFollowing(seguidor.id)
            });
        })
        .join("");
}

function renderSeguidos(persona) {
    const seguidos = getFollowing(persona);

    if (seguidos.length === 0) {
        listaSeguidos.innerHTML = `<p class="profile-empty">Todavía no sigue a nadie.</p>`;
        return;
    }

    listaSeguidos.innerHTML = seguidos
        .map(seguido => {
            const loSigo = isFollowing(seguido.id);

            return new User(seguido).getProfileRowPresentation({
                label: esMiPerfil ? "Dejar de seguir" : (loSigo ? "Siguiendo" : "Seguir"),
                type: "toggle",
                isFollowing: esMiPerfil ? true : loSigo
            });
        })
        .join("");
}

function renderComunidad() {
    listaComunidad.innerHTML = getCommunityUsers()
        .map(persona => {
            const loSigo = isFollowing(persona.id);

            return new User(persona).getProfileRowPresentation({
                label: loSigo ? "Siguiendo" : "Seguir",
                type: "toggle",
                isFollowing: loSigo
            });
        })
        .join("");
}

document.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-action]");
    if (!boton) return;

    const id = parseInt(boton.dataset.userId);
    const accion = boton.dataset.action;

    if (accion === "toggle") {
        const resultado = toggleFollow(id);
        if (!resultado) return;

        renderPerfil();
        mostrarAviso(resultado.isFollowing
            ? `Ahora seguís a ${resultado.target.fullName}`
            : `Dejaste de seguir a ${resultado.target.fullName}`);
    }

    if (accion === "remove") {
        const quitado = removeFollower(id);
        if (!quitado) return;

        renderPerfil();
        mostrarAviso(`${quitado.fullName} ya no te sigue`);
    }
});

function cargarFormulario() {
    const persona = getCurrentUser();

    inputNombre.value = persona.fullName;
    inputUsuario.value = persona.userName;
    inputEmail.value = persona.email;
    inputBio.value = persona.bio;
    inputPassword.value = "";
    inputAvatar.value = "";
}

function validarFormulario({ nombre, usuario, email, password }) {
    if (nombre === "") return "El nombre completo no puede quedar vacío.";
    if (nombre.length < 3) return "El nombre completo es demasiado corto.";

    if (usuario === "") return "El nombre de usuario no puede quedar vacío.";
    if (!/^[a-zA-Z0-9._]{3,20}$/.test(usuario)) {
        return "El usuario debe tener entre 3 y 20 caracteres (letras, números, punto o guion bajo).";
    }

    const repetido = getUsers().some(otro =>
        otro.id !== getCurrentUser().id &&
        otro.userName.toLowerCase() === usuario.toLowerCase()
    );
    if (repetido) return "Ese nombre de usuario ya está en uso.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return "Ingresá un correo electrónico válido.";
    }

    if (password !== "" && password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    return null;
}

function guardarCambios() {
    const persona = getCurrentUser();

    const nombre = inputNombre.value.trim();
    const usuario = inputUsuario.value.trim().replace(/^@/, "");
    const email = inputEmail.value.trim();
    const bio = inputBio.value.trim();
    const password = inputPassword.value;
    const archivo = inputAvatar.files[0];

    const error = validarFormulario({ nombre, usuario, email, password });
    if (error) {
        mostrarAviso(error, "error");
        return;
    }

    if (archivo && archivo.size > PESO_MAXIMO_AVATAR) {
        mostrarAviso("La imagen es muy pesada (máximo 1,5 MB).", "error");
        return;
    }

    const guardar = (avatar) => {
        updateUser({
            id: persona.id,
            fullName: nombre,
            userName: usuario,
            email: email,
            bio: bio,
            avatar: avatar
        });

        renderPerfil();
        cerrarModal("modalEditarPerfil");
        mostrarAviso("Perfil actualizado correctamente.");
    };

    if (archivo) {
        const lector = new FileReader();
        lector.onload = () => guardar(lector.result);
        lector.readAsDataURL(archivo);
    } else {
        guardar(persona.avatar);
    }
}

formEditarPerfil.addEventListener("submit", (event) => {
    event.preventDefault();
    guardarCambios();
});

document.getElementById("modalEditarPerfil").addEventListener("show.bs.modal", cargarFormulario);

if (usuarioPedido && !perfilPedido) {
    mostrarAviso("No encontramos ese perfil. Te mostramos el tuyo.", "error");
}

renderPerfil();
