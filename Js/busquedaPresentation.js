/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

!localStorage.getItem("token") && (window.location.href = "loguear.html");

const query = getSearchQuery();

const currentUser = getCurrentUser();
const headerName = document.querySelector(".text-profile");
currentUser?.name && (headerName.innerText = currentUser.name);

const ui = {
    title: document.getElementById("tituloResultados"),
    results: document.getElementById("resultadosBusqueda")
};

const searchForm = document.querySelector(".search-form");
searchForm && (searchForm.search.value = query);

const list = new ListaPaginada({
    contenedor: ui.results,
    zonaScroll: window,
    cargarPagina: (page, cb) => loadSearchUsers(query, page, cb),
    armarFila: (u) => new User(u).getSearchCardPresentation(u.isFollowing),
    vacio: query
        ? `We couldn't find anyone matching "${User.escape(query)}". Try another name or @username.`
        : "No users to show.",
    alCargar: (total, done) => {
        ui.title.innerText = buildSearchTitle(total, query, !done);
    }
});

list.reiniciar();

ui.results.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action='toggle']");
    if (!btn) return;

    const userId = parseInt(btn.dataset.userId);
    const alreadyFollowing = btn.getAttribute("aria-pressed") === "true";

    followUser(userId, alreadyFollowing, (res) => {
        btn.classList.toggle("is-following", res.isFollowing);
        btn.setAttribute("aria-pressed", res.isFollowing);
        btn.innerText = res.isFollowing ? "Following" : "Follow";
        show("Follow", res.isFollowing ? "You are now following them" : "You stopped following them", "success");
    });
});

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = searchForm.search.value.trim();
    window.location.href = `busqueda.html?search=${encodeURIComponent(q)}`;
});