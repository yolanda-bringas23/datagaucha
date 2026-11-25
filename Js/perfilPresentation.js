/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const perfilAvatar = document.getElementById("perfilAvatar");
const perfilInfo = document.getElementById("perfilInfo");
const perfilPublicaciones = document.getElementById("perfilPublicaciones");
const btnEditarPerfil = document.getElementById("btnEditarPerfil");

const btnSeguidores = document.getElementById("btnSeguidores");
const btnSeguidos = document.getElementById("btnSeguidos");
const listaSeguidores = document.getElementById("listaSeguidores");
const listaSeguidos = document.getElementById("listaSeguidos");

const formEditarPerfil = document.getElementById("formEditarPerfil");
const modalEditarPerfil = document.getElementById("modalEditarPerfil");
const btnGuardarPerfil = document.getElementById("btnGuardarPerfil");
const inputAvatar = document.getElementById("inputAvatar");
const inputNombre = document.getElementById("inputNombre");
const inputUsuario = document.getElementById("inputUsuario");
const inputPassword = document.getElementById("inputPassword");

const PESO_MAXIMO_AVATAR = 1.5 * 1024 * 1024;
const aviso = new Toast("avisoPerfil");
const parametros = new URLSearchParams(window.location.search);
const usuarioPedido = parametros.get("usuario");

let perfil;
let seguidores = [];
let seguidos = [];

function renderPerfil(usuario) {
    perfil = usuario;
    perfilAvatar.src = usuario.avatar || "../img/avatar.jpg";
    perfilAvatar.alt = `Foto de perfil de ${usuario.fullName}`;
    perfilInfo.innerHTML = usuario.getProfilePresentation();
    btnEditarPerfil.hidden = false;
}

function cargarPublicaciones() {
    getPosts({ currentPage: 1, pageSize: 12 }, (posts) => {
        const publicaciones = posts.filter(post => post.userName === perfil.userName);

        perfilPublicaciones.innerHTML = publicaciones.length
            ? publicaciones.map(post => post.getPostPresentation()).join("").replaceAll('href="html/', 'href="')
            : '<p class="profile-empty">No hay publicaciones tuyas en el inicio reciente.</p>';
    });
}

function renderSeguidores() {
    btnSeguidores.innerText = `${seguidores.length} Seguidores`;
    btnSeguidos.innerText = `${seguidos.length} Siguiendo`;

    listaSeguidores.innerHTML = seguidores.length
        ? seguidores.map(usuario => {
            const loSigo = seguidos.some(seguido => seguido.id === usuario.id);
            return usuario.getProfileRowPresentation({
                label: loSigo ? "Siguiendo" : "Seguir",
                type: "toggle",
                isFollowing: loSigo
            });
        }).join("")
        : '<p class="profile-empty">Todavía no tenés seguidores.</p>';

    listaSeguidos.innerHTML = seguidos.length
        ? seguidos.map(usuario => usuario.getProfileRowPresentation({
            label: "Dejar de seguir",
            type: "toggle",
            isFollowing: true
        })).join("")
        : '<p class="profile-empty">Todavía no seguís a nadie.</p>';
}

function cargarSeguidores() {
    getFollowing(perfil.id, (usuarios) => {
        seguidos = usuarios;
        btnSeguidos.disabled = false;
        renderSeguidores();

        getFollowers(perfil.id, (usuarios) => {
            seguidores = usuarios;
            btnSeguidores.disabled = false;
            renderSeguidores();
        });
    });
}

document.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-user-id][data-action='toggle']");
    if (!boton) return;

    const id = Number(boton.dataset.userId);
    const loSigo = seguidos.some(usuario => usuario.id === id);

    toggleFollow(id, loSigo, (resultado) => {
        if (resultado.isFollowing) {
            seguidos.push(resultado.target);
        } else {
            seguidos = seguidos.filter(usuario => usuario.id !== id);
        }

        renderSeguidores();
        aviso.mostrar(resultado.isFollowing ? "Ahora seguís a este usuario." : "Dejaste de seguir a este usuario.");
    });
});

modalEditarPerfil.addEventListener("show.bs.modal", () => {
    inputNombre.value = perfil.fullName;
    inputUsuario.value = perfil.userName;
    inputPassword.value = "";
    inputAvatar.value = "";
});

formEditarPerfil.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!perfil || btnGuardarPerfil.disabled) return;

    const name = inputNombre.value.trim();
    const userName = inputUsuario.value.trim().replace(/^@/, "");
    const password = inputPassword.value;
    const file = inputAvatar.files[0];

    if (!name || !userName) {
        aviso.mostrar("Completá el nombre y el nombre de usuario.", "error");
        return;
    }

    if (file && file.size > PESO_MAXIMO_AVATAR) {
        aviso.mostrar("La imagen es muy pesada (máximo 1,5 MB).", "error");
        return;
    }

    btnGuardarPerfil.disabled = true;
    updateProfile({ name, userName, password, file }, (usuario) => {
        renderPerfil(usuario);
        cargarPublicaciones();
        bootstrap.Modal.getInstance(modalEditarPerfil)?.hide();
        aviso.mostrar("Perfil actualizado correctamente.");
    }).finally(() => {
        btnGuardarPerfil.disabled = false;
    });
});

document.getElementById("cerrarSesion").addEventListener("click", logout);

if (!localStorage.getItem("token")) {
    window.location.href = "loguear.html";
} else {
    getProfile((usuario) => {
        if (usuarioPedido && usuarioPedido.toLowerCase() !== usuario.userName.toLowerCase()) {
            perfilInfo.innerHTML = '<p>No se puede consultar este perfil. <a href="perfil.html">Volver a mi perfil</a></p>';
            return;
        }

        renderPerfil(usuario);
        cargarPublicaciones();
        cargarSeguidores();
    });
}
