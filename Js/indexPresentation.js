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

let filtroBusqueda = "";
let reaccionEnProceso = false; // <-- NUEVO: evita doble clic

const lista = new ListaPaginada({
    contenedor: contenedorLista,
    zonaScroll: document.getElementById("section"), // <-- ÚNICO CAMBIO: Apuntamos a la sección de scroll
    cargarPagina: (page, cb) => cargarPaginaPosts(page, cb),
    armarFila: (post) => post.getPostPresentation(),
    vacio: "No hay publicaciones todavía."
});

lista.reiniciar();


searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = (searchForm.search?.value ?? "").trim();
    filtroBusqueda = q;
    lista.reiniciar();
});


contenedorLista.addEventListener("click", (event) => {
    const dropdownToggle = event.target.closest("[data-dropdown-toggle='true']");
    if (dropdownToggle) {
        event.preventDefault();
        event.stopPropagation();

        const menu = dropdownToggle.nextElementSibling;
        const isOpen = menu && menu.classList.contains("show");

        document.querySelectorAll("#listaPublicaciones .dropdown-menu.show")
            .forEach(m => m.classList.remove("show"));
        document.querySelectorAll("#listaPublicaciones [data-dropdown-toggle='true']")
            .forEach(b => b.setAttribute("aria-expanded", "false"));

        if (!isOpen && menu) {
            menu.classList.add("show");
            dropdownToggle.setAttribute("aria-expanded", "true");
        }
        return;
    }

    
    const reactionBtn = event.target.closest("[data-action='reaction']");
    if (reactionBtn) {
        manejarReaccion(reactionBtn);
        return;
    }

    
    const banBtn = event.target.closest("[data-action='ban']");
    if (banBtn) {
        event.preventDefault();
        manejarBan(banBtn);
        return;
    }
});


document.addEventListener("click", (event) => {
    if (!event.target.closest("#listaPublicaciones .dropdown")) {
        document.querySelectorAll("#listaPublicaciones .dropdown-menu.show")
            .forEach(m => m.classList.remove("show"));
        document.querySelectorAll("#listaPublicaciones [data-dropdown-toggle='true']")
            .forEach(b => b.setAttribute("aria-expanded", "false"));
    }
});


formCrear?.addEventListener("submit", (event) => {
    event.preventDefault();

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
        search: filtroBusqueda
    }, (posts) => {
        if (filtroBusqueda) {
            const q = filtroBusqueda.toLowerCase();
            posts = posts.filter(p =>
                (p.title || "").toLowerCase().includes(q) ||
                (p.body || "").toLowerCase().includes(q)
            );
        }
        callback(posts);
    });
}

function manejarReaccion(btn) {
    if (reaccionEnProceso) return;
    reaccionEnProceso = true;

    const postId = parseInt(btn.dataset.postId);
    const type = btn.dataset.type;
    const card = btn.closest(".publication-card");
    const estabaActiva = btn.classList.contains("reaction-active");

    const btnLike = card.querySelector("[data-type='Like']");
    const btnDislike = card.querySelector("[data-type='Dislike']");
    
    const likeIcon = btnLike.querySelector("i").outerHTML;
    const dislikeIcon = btnDislike.querySelector("i").outerHTML;
    
    let likeCount = parseInt(btnLike.innerText.trim()) || 0;
    let dislikeCount = parseInt(btnDislike.innerText.trim()) || 0;

    if (estabaActiva) {
        deleteReaction(postId, () => {
            card.querySelectorAll("[data-action='reaction']")
                .forEach((b) => b.classList.remove("reaction-active"));
            
            if (type === "Like") likeCount = Math.max(0, likeCount - 1);
            else dislikeCount = Math.max(0, dislikeCount - 1);
            
            btnLike.innerHTML = `${likeIcon} ${likeCount}`;
            btnDislike.innerHTML = `${dislikeIcon} ${dislikeCount}`;
            
            show("Reacción", "Quitaste tu reacción", "success");
            reaccionEnProceso = false;
        });
    } else {
        const yaTeniaDislike = btnDislike.classList.contains("reaction-active");
        const yaTeniaLike = btnLike.classList.contains("reaction-active");

        setReaction(postId, type, () => {
            card.querySelectorAll("[data-action='reaction']")
                .forEach((b) => b.classList.remove("reaction-active"));
            btn.classList.add("reaction-active");

            if (type === "Like") {
                if (yaTeniaDislike) dislikeCount = Math.max(0, dislikeCount - 1);
                if (!yaTeniaLike) likeCount++;
            } else {
                if (yaTeniaLike) likeCount = Math.max(0, likeCount - 1);
                if (!yaTeniaDislike) dislikeCount++;
            }

            btnLike.innerHTML = `${likeIcon} ${likeCount}`;
            btnDislike.innerHTML = `${dislikeIcon} ${dislikeCount}`;

            show("Reacción", `Reaccionaste con ${type}`, "success");
            reaccionEnProceso = false;
        });
    }

    setTimeout(() => { reaccionEnProceso = false; }, 2000);
}


function unescapeHtml(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}


function buscarUsuarioExacto(userName, callback) {
    const targetLower = userName.toLowerCase();
    const pageSize = 100;
    let page = 1;

    function fetchPage() {
        getUsers({ currentPage: page, pageSize, search: userName }, (users) => {
            const found = users.find(u => u.userName.toLowerCase() === targetLower);
            if (found) {
                callback(found);
                return;
            }
            if (users.length < pageSize) {
                callback(null);
                return;
            }
            page++;
            if (page > 20) {
                callback(null);
                return;
            }
            fetchPage();
        });
    }

    fetchPage();
}

// --- Ban user ---
function manejarBan(btn) {
    const userName = unescapeHtml(btn.dataset.userName);
    if (!userName) {
        show("Ban", "No se pudo identificar al usuario", "error");
        return;
    }

    buscarUsuarioExacto(userName, (target) => {
        if (!target) {
            show("Ban", "No se encontró el usuario en la base de datos", "error");
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
            inputValidator: (value) => (!value || !value.trim()) ? "El motivo es obligatorio" : null
        }).then((result) => {
            if (!result.isConfirmed) return;

            const fechaActual = new Date().toISOString();

            createBan({
                userId: target.id,
                reason: result.value.trim(),
                bannedAt: fechaActual,
                expiresAt: null
            }, () => {
                show("Ban", `@${userName} fue baneado exitosamente`, "success");
            });
        });
    });
}