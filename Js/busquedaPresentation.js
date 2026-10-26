const resultadosBusqueda = document.getElementById("resultadosBusqueda");
const tituloResultados = document.getElementById("tituloResultados");
const inputBusqueda = document.querySelector(".search-form input[name='search']");

const avisoBusqueda = new Toast("avisoBusqueda");

const parametros = new URLSearchParams(window.location.search);
const consulta = (parametros.get("search") || "").trim();

if (inputBusqueda) inputBusqueda.value = consulta;

function renderResultados() {
    const personas = searchUsers(consulta);

    if (consulta === "") {
        tituloResultados.innerText = `${personas.length} personas en la comunidad`;
    } else if (personas.length === 1) {
        tituloResultados.innerText = `1 resultado para "${consulta}"`;
    } else {
        tituloResultados.innerText = `${personas.length} resultados para "${consulta}"`;
    }

    if (personas.length === 0) {
        resultadosBusqueda.innerHTML = `
            <p class="profile-empty">
                No encontramos a nadie con "${User.escape(consulta)}".
                Probá con otro nombre o @usuario.
            </p>`;
        return;
    }

    resultadosBusqueda.innerHTML = personas
        .map(persona => new User(persona).getSearchCardPresentation(isFollowing(persona.id)))
        .join("");
}

document.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-action='toggle']");
    if (!boton) return;

    const id = parseInt(boton.dataset.userId);
    const resultado = toggleFollow(id);
    if (!resultado) return;

    renderResultados();

    avisoBusqueda.mostrar(resultado.isFollowing
        ? `Ahora seguís a ${resultado.target.fullName}`
        : `Dejaste de seguir a ${resultado.target.fullName}`);
});

const nombreEnHeader = document.querySelector(".text-profile");
if (nombreEnHeader) nombreEnHeader.innerText = getCurrentUser().fullName;

renderResultados();
