/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

if (!localStorage.getItem("token")) {
    window.location.href = "html/loguear.html";
}

const currentUser = getCurrentUser();
const headerName = document.querySelector(".text-profile");
if (currentUser?.userName && headerName) {
    headerName.innerText = currentUser.userName;
}

const contenedorLista = document.getElementById("listaPublicaciones");
const formCrear = document.getElementById("formCrearPost");
const searchForm = document.querySelector(".search-form");

const lista = new ListaPaginada({
    contenedor: contenedorLista,
    zonaScroll: window,
    cargarPagina: (page, cb) => cargarPaginaPosts(page, cb),
    armarFila: (post) => post.getPostPresentation(),
    vacio: "No hay publicaciones todavía."
});

lista.reiniciar();

// --- Buscador del header -> redirige a busqueda.html ---
searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = (searchForm.search?.value ?? "").trim();
    window.location.href = `html/busqueda.html?search=${encodeURIComponent(q)}`;
});

// --- Delegación de eventos en la lista de posts ---
contenedorLista.addEventListener("click", (event) => {
    const reactionBtn = event.target.closest("[data-action='reaction']");
    if (reactionBtn) {
        manejarReaccion(reactionBtn);
        return;
    }

    const banBtn = event.target.closest("[data-action='ban']");
    if (banBtn) {
        event.preventDefault();
        manejarBan(banBtn);
    }
});

// --- Crear publicación (modal) ---
formCrear?.addEventListener("submit", (event) => {
    event.preventDefault();

    // El HTML usa name="title" / "content" / "image"
    // El backend espera: title / body / file
    const formData = new FormData();
    formData.append("title", formCrear.title.value.trim());
    formData.append("body", formCrear.content.value.trim());

    const archivo = formCrear.image.files[0];
    if (archivo) formData.append("file", archivo);

    createPost(formData, () => {
        formCrear.reset();
        bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
        lista.reiniciar();
        show("Publicación", "Creada correctamente", "success");
    });
});

// --- Carga paginada de posts ---
function cargarPaginaPosts(page, callback) {
    getPosts({
        currentPage: page,
        pageSize: PAGE_SIZE,
        orderBy: "createdAt",
        orderDirection: "desc",
        search: ""
    }, callback);
}

// --- Reacción Like/Dislike (toggle) ---
function manejarReaccion(btn) {
    const postId = parseInt(btn.dataset.postId);
    const type = btn.dataset.type;
    const card = btn.closest(".publication-card");
    const estabaActiva = btn.classList.contains("reaction-active");

    if (estabaActiva) {
        deleteReaction(postId, () => {
            card.querySelectorAll("[data-action='reaction']")
                .forEach((b) => b.classList.remove("reaction-active"));
            show("Reacción", "Quitaste tu reacción", "success");
        });
    } else {
        setReaction(postId, type, () => {
            card.querySelectorAll("[data-action='reaction']")
                .forEach((b) => b.classList.remove("reaction-active"));
            btn.classList.add("reaction-active");
            show("Reacción", `Reaccionaste con ${type}`, "success");
        });
    }
}

// --- Ban user (PostDTO no trae userId -> se resuelve por search) ---
function manejarBan(btn) {
    const userName = btn.dataset.userName;
    if (!userName) {
        show("Ban", "No se pudo identificar al usuario", "error");
        return;
    }

    getUsers({ currentPage: 1, pageSize: 10, search: userName }, (users) => {
        const target = users.find((u) => u.userName === userName);
        if (!target) {
            show("Ban", "No se encontró el usuario", "error");
            return;
        }

        Swal.fire({
            title: `Banear a @${userName}`,
            input: "text",
            inputLabel: "Motivo del ban",
            inputPlaceholder: "Ej: incumplimiento de normas",
            showCancelButton: true,
            confirmButtonText: "Banear",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => (!value || !value.trim())
                ? "El motivo es obligatorio"
                : null
        }).then((result) => {
            if (!result.isConfirmed) return;

            createBan({
                userId: target.id,
                reason: result.value.trim(),
                bannedAt: new Date().toISOString(),
                expiresAt: null
            }, () => {
                show("Ban", `@${userName} fue baneado`, "success");
            });
        });
    });
}