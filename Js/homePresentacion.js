/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

!localStorage.getItem("token") && (window.location.href = "html/loguear.html");

const currentUser = getHomeCurrentUser();
const nombreEnHeader = document.querySelector(".text-profile");
if(currentUser?.userName && nombreEnHeader){
    nombreEnHeader.innerText = currentUser.userName
}

const muro = document.getElementById("section");

const lista = new ListaPaginada({
    contenedor: muro,
    zonaScroll: window,
    cargarPagina: (page, cb) => cargarPostsHome(page, cb),
    armarFila: (post) => new Post(post).getPostPresentation(),
    vacio: "No hay publicaciones todavía."
});

lista.reiniciar();

muro.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action='reaction']");
    if (!btn) return;

    const postId = parseInt(btn.dataset.postId);
    const type = btn.dataset.type;

    reaccionarPost(postId, type, () => {
        const card = btn.closest(".publication-card");
        card.querySelectorAll("[data-action='reaction']")
            .forEach((b) => b.classList.remove("reaction-active"));
        btn.classList.add("reaction-active");
        show("Reacción", `Reaccionaste con ${type}`, "success");
    });
});

const formCrear = document.getElementById("formCrearPost");
formCrear?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(formCrear);

    crearPostHome(formData, () => {
        formCrear.reset();
        bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
        lista.reiniciar();
        show("Publicación", "Creada correctamente", "success");
    });
});