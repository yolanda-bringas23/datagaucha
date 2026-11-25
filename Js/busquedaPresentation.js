/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

if (!localStorage.getItem("token")) {
    window.location.href = "loguear.html";
}

function getSearchQuery() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("search") ?? "").trim();
}

function buildSearchTitle(total, q, done) {
    const sufijo = done ? "" : "+";
    if (!q) return `${total} usuario${total === 1 ? "" : "s"}${sufijo}`;
    return `${total} resultado${total === 1 ? "" : "s"} para "${User.escape(q)}"${sufijo}`;
}

const query = getSearchQuery();
const currentUser = getCurrentUser();

const headerName = document.querySelector(".text-profile");
const nombreHeader = currentUser?.userName ?? currentUser?.name ?? "";
if (nombreHeader && headerName) headerName.innerText = nombreHeader;

const ui = {
    title: document.getElementById("searchTitle"),
    results: document.getElementById("searchResults")
};

const searchForm = document.querySelector(".search-form");
if (searchForm && searchForm.search) searchForm.search.value = query;

function loadSearchUsers(q, page, cb) {
    getUsers({ currentPage: page, pageSize: PAGE_SIZE, search: q }, cb);
}

const list = new ListaPaginada({
    contenedor: ui.results,
    zonaScroll: document.getElementById("section"), // <-- ÚNICO CAMBIO: Apuntamos a la sección de scroll
    cargarPagina: (page, cb) => loadSearchUsers(query, page, cb),
    armarFila: (user) => user.getSearchCardPresentation(user.isFollowing), // Pasamos el estado real
    vacio: query
        ? `No encontramos a nadie con "${User.escape(query)}".`
        : "No hay usuarios para mostrar.",
    alCargar: (total, done) => {
        ui.title.innerText = buildSearchTitle(total, query, done);
        ui.title.hidden = false;
    }
});

list.reiniciar();

ui.results.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        return;
    }

    // 1. Lógica para Follow
    const btnToggle = event.target.closest("[data-action='toggle']");
    if (btnToggle) {
        const userId = parseInt(btnToggle.dataset.userId);
        
        // CORREGIDO: Leemos la clase para saber si ya lo sigue o no
        const alreadyFollowing = btnToggle.classList.contains("is-following");

        toggleFollow(userId, alreadyFollowing, (res) => {
            btnToggle.classList.toggle("is-following", res.isFollowing);
            // CORREGIDO: Actualizamos el texto para que cambie de "Seguir" a "Siguiendo"
            btnToggle.innerText = res.isFollowing ? "Siguiendo" : "Seguir";
            show("Follow", res.isFollowing ? "Ahora lo seguís" : "Dejaste de seguirlo", "success");
        });
        return;
    }

    // 2. Lógica para Ban
    const btnBan = event.target.closest("[data-action='ban']");
    if (btnBan) {
        const userId = parseInt(btnBan.dataset.userId);
        const userName = btnBan.dataset.userName;

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

            createBan({
                userId: userId,
                reason: result.value.trim(),
                bannedAt: new Date().toISOString(),
                expiresAt: null
            }, () => {
                show("Ban", `@${userName} fue baneado exitosamente`, "success");
            });
        });
    }
});

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = searchForm.search.value.trim();
    
    if (q === "") {
        window.location.href = `busqueda.html`;
    } else {
        window.location.href = `busqueda.html?search=${encodeURIComponent(q)}`;
    }
});