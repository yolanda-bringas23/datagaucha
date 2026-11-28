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

const postsContainer = document.getElementById("listaPublicaciones");
const createForm = document.getElementById("formCrearPost");
const searchForm = document.querySelector(".search-form");

let reactionInProgress = false;
let creatingPost = false;

const list = new PaginatedList({
    container: postsContainer,
    scrollZone: document.getElementById("section"),
    loadPage: (page, cb) => loadPostsPage(page, cb),
    buildRow: (post) => post.getPostHtml(),
    emptyMessage: "No hay publicaciones todavía."
});

list.reset();

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = (searchForm.search?.value ?? "").trim();
    if (q === "") return;
    window.location.href = `html/search.html?search=${encodeURIComponent(q)}`;
});

postsContainer.addEventListener("click", (event) => {
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
        handleReaction(reactionBtn);
        return;
    }

    const banBtn = event.target.closest("[data-action='ban']");
    if (banBtn) {
        event.preventDefault();
        handleBan(banBtn);
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

createForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (creatingPost) return;
    creatingPost = true;

    const submitButton = createForm.querySelector("button[type='submit']");
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Publicando...";
    }

    const formData = new FormData();
    formData.append("title", createForm.title.value.trim());
    formData.append("body", createForm.content.value.trim());

    const file = createForm.image.files[0];
    if (file) formData.append("file", file);

    createPost(formData, () => {
        creatingPost = false;
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = "Aceptar";
        }

        createForm.reset();
        bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
        list.reset();
        show("Publicación", "Creada correctamente", "success");
    });
});

function loadPostsPage(page, callback) {
    getPosts({
        currentPage: page,
        pageSize: PAGE_SIZE,
        orderBy: "createdAt",
        orderDirection: "desc",
        search: ""
    }, callback);
}

function handleReaction(btn) {
    if (reactionInProgress) return;
    reactionInProgress = true;

    const postId = parseInt(btn.dataset.postId);
    const type = btn.dataset.type;
    const card = btn.closest(".publication-card");
    const wasActive = btn.classList.contains("reaction-active");

    const likeBtn = card.querySelector("[data-type='Like']");
    const dislikeBtn = card.querySelector("[data-type='Dislike']");

    const likeIcon = likeBtn.querySelector("i").outerHTML;
    const dislikeIcon = dislikeBtn.querySelector("i").outerHTML;

    let likeCount = parseInt(likeBtn.innerText.trim()) || 0;
    let dislikeCount = parseInt(dislikeBtn.innerText.trim()) || 0;

    if (wasActive) {
        deleteReaction(postId, () => {
            card.querySelectorAll("[data-action='reaction']")
                .forEach((b) => b.classList.remove("reaction-active"));

            if (type === "Like") likeCount = Math.max(0, likeCount - 1);
            else dislikeCount = Math.max(0, dislikeCount - 1);

            likeBtn.innerHTML = `${likeIcon} ${likeCount}`;
            dislikeBtn.innerHTML = `${dislikeIcon} ${dislikeCount}`;

            show("Reacción", "Quitaste tu reacción", "success");
            reactionInProgress = false;
        });
    } else {
        const hadDislike = dislikeBtn.classList.contains("reaction-active");
        const hadLike = likeBtn.classList.contains("reaction-active");

        setReaction(postId, type, () => {
            card.querySelectorAll("[data-action='reaction']")
                .forEach((b) => b.classList.remove("reaction-active"));
            btn.classList.add("reaction-active");

            if (type === "Like") {
                if (hadDislike) dislikeCount = Math.max(0, dislikeCount - 1);
                if (!hadLike) likeCount++;
            } else {
                if (hadLike) likeCount = Math.max(0, likeCount - 1);
                if (!hadDislike) dislikeCount++;
            }

            likeBtn.innerHTML = `${likeIcon} ${likeCount}`;
            dislikeBtn.innerHTML = `${dislikeIcon} ${dislikeCount}`;

            show("Reacción", `Reaccionaste con ${type}`, "success");
            reactionInProgress = false;
        });
    }

    setTimeout(() => { reactionInProgress = false; }, 2000);
}

function unescapeHtml(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}

function findExactUser(userName, callback) {
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

function handleBan(btn) {
    const userName = unescapeHtml(btn.dataset.userName);
    if (!userName) {
        show("Ban", "No se pudo identificar al usuario", "error");
        return;
    }

    findExactUser(userName, (target) => {
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

            const currentDate = new Date().toISOString();

            createBan({
                userId: target.id,
                reason: result.value.trim(),
                bannedAt: currentDate,
                expiresAt: null
            }, () => {
                show("Ban", `@${userName} fue baneado exitosamente`, "success");
            });
        });
    });
}