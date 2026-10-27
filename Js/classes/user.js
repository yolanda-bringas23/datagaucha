class User {
    constructor(element) {
        const { id, userName, fullName, email, avatar, bio, followers, following } = element;

        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.avatar = avatar;
        this.bio = bio;
        this.followers = followers || [];
        this.following = following || [];
    }

    static escape(text) {
        return String(text ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    getPerfilHref() {
        return `perfil.html?usuario=${encodeURIComponent(this.userName)}`;
    }

    getAvatarPresentation(clases = "user-avatar") {
        return `<img class="${clases}" src="${User.escape(this.avatar)}" alt="Foto de perfil de ${User.escape(this.fullName)}" width="44" height="44">`;
    }

    getProfilePresentation() {
        return `
            <h1>${User.escape(this.fullName)}</h1>
            <p class="profile-username">@${User.escape(this.userName)}</p>
            <p class="profile-bio">${User.escape(this.bio)}</p>
            <p class="profile-email"><i class="fa-solid fa-envelope"></i> ${User.escape(this.email)}</p>
        `;
    }

    getFollowButtonPresentation(loSigo, claseExtra = "") {
        const clase = ["btn-follow", loSigo ? "is-following" : "", claseExtra]
            .filter(Boolean)
            .join(" ");
        const texto = loSigo ? "Siguiendo" : "Seguir";

        return `<button
                    type="button"
                    class="${clase}"
                    data-action="toggle"
                    data-user-id="${this.id}"
                    aria-pressed="${loSigo}"
                    title="${loSigo ? "Dejar de seguir" : "Seguir"}"
                >${texto}</button>`;
    }

    getSearchCardPresentation(loSigo) {
        return `
            <article class="search-card" data-user-id="${this.id}">
                <a class="btn-user user-link" href="${this.getPerfilHref()}">
                    ${this.getAvatarPresentation("user-avatar")}
                    <div class="search-user-info">
                        <h2 class="search-name">${User.escape(this.fullName)}</h2>
                        <h3 class="search-username">@${User.escape(this.userName)}</h3>
                    </div>
                </a>
                <div class="search-card-actions">
                    ${this.getFollowButtonPresentation(loSigo)}
                    <a class="btn-follow link-ver-perfil" href="${this.getPerfilHref()}">Ver perfil</a>
                </div>
            </article>
        `;
    }

    getProfileRowPresentation(action) {
        const boton = action
            ? `<button
                    type="button"
                    class="${action.type === "remove"
                        ? "user-row-btn btn-quitar"
                        : `user-row-btn btn-follow${action.isFollowing ? " is-following" : ""}`}"
                    data-action="${action.type}"
                    data-user-id="${this.id}"
                >${User.escape(action.label)}</button>`
            : `<span class="user-row-badge">Vos</span>`;

        return `
            <div class="user-row" data-user-id="${this.id}">
                <a class="user-row-link" href="${this.getPerfilHref()}">
                    ${this.getAvatarPresentation("user-row-avatar")}
                    <div class="user-row-info">
                        <p class="user-row-name">${User.escape(this.fullName)}</p>
                        <p class="user-row-username">@${User.escape(this.userName)}</p>
                    </div>
                </a>
                ${boton}
            </div>
        `;
    }

    getAuthorPresentation(loSigo, mostrarBotonDeSeguir = true) {
        return `
            <div class="author-row">
                <a class="btn-user user-link" href="${this.getPerfilHref()}">
                    ${this.getAvatarPresentation("user-avatar")}
                    <p class="p-index">${User.escape(this.fullName)}</p>
                </a>
                ${mostrarBotonDeSeguir ? this.getFollowButtonPresentation(loSigo) : ""}
            </div>
        `;
    }

    getCommentPresentation(text, loSigo, mostrarBoton = true) {
        const boton = mostrarBoton ? this.getFollowButtonPresentation(loSigo, "btn-follow-sm") : "";

        return `
            <div class="User-comment" data-user-id="${this.id}">
                <div class="user-comment-header">
                    ${this.getAvatarPresentation("user-avatar comment-avatar")}
                    <a class="comment-username comment-author-link" href="${this.getPerfilHref()}">${User.escape(this.fullName)}</a>
                    <span class="comment-follow">${boton}</span>
                </div>
                <p class="comment-text">${User.escape(text)}</p>
            </div>
        `;
    }
}
