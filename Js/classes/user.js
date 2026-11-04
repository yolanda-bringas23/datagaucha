class User {
    constructor(element) {
        const {
            id, userName, name, fullName, email,
            avatarUrl, urlAvatar, avatar, bio, dateBirth, isFollowing
        } = element;

        this.id = id;
        this.userName = userName ?? "";
        this.fullName = name ?? fullName ?? userName ?? "";
        this.email = email ?? "";
        this.avatar = avatarUrl ?? urlAvatar ?? avatar ?? "";
        this.bio = bio ?? "";
        this.dateBirth = dateBirth ?? null;
        this.isFollowing = isFollowing ?? false;
    }

    static escape(text) {
        return String(text ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    getProfileHref() {
        return `perfil.html?usuario=${encodeURIComponent(this.userName)}`;
    }

    getAvatarPresentation(classes = "user-avatar") {
        return `<img class="${classes}" src="${User.escape(this.avatar)}" alt="Profile picture of ${User.escape(this.fullName)}" width="44" height="44">`;
    }

    getProfilePresentation() {
        return `
            <h1>${User.escape(this.fullName)}</h1>
            <p class="profile-username">@${User.escape(this.userName)}</p>
            <p class="profile-bio">${User.escape(this.bio)}</p>
            <p class="profile-email"><i class="fa-solid fa-envelope"></i> ${User.escape(this.email)}</p>
        `;
    }

    getFollowButtonPresentation(isFollowing, extraClass = "") {
        const classes = ["btn-follow", isFollowing ? "is-following" : "", extraClass]
            .filter(Boolean)
            .join(" ");
        const text = isFollowing ? "Following" : "Follow";

        return `<button
                    type="button"
                    class="${classes}"
                    data-action="toggle"
                    data-user-id="${this.id}"
                    aria-pressed="${isFollowing}"
                >${text}</button>`;
    }

    getSearchCardPresentation(isFollowing) {
        return `
            <article class="search-card" data-user-id="${this.id}">
                <a class="btn-user user-link" href="${this.getProfileHref()}">
                    ${this.getAvatarPresentation("user-avatar")}
                    <div class="search-user-info">
                        <h2 class="search-name">${User.escape(this.fullName)}</h2>
                        <h3 class="search-username">@${User.escape(this.userName)}</h3>
                    </div>
                </a>
                <div class="search-card-actions">
                    ${this.getFollowButtonPresentation(isFollowing)}
                    <a class="btn-follow link-ver-perfil" href="${this.getProfileHref()}">View profile</a>
                </div>
            </article>
        `;
    }

    getProfileRowPresentation(action) {
        const button = action
            ? `<button
                    type="button"
                    class="${action.type === "remove"
                        ? "user-row-btn btn-quitar"
                        : `user-row-btn btn-follow${action.isFollowing ? " is-following" : ""}`}"
                    data-action="${action.type}"
                    data-user-id="${this.id}"
                >${User.escape(action.label)}</button>`
            : `<span class="user-row-badge">You</span>`;

        return `
            <div class="user-row" data-user-id="${this.id}">
                <a class="user-row-link" href="${this.getProfileHref()}">
                    ${this.getAvatarPresentation("user-row-avatar")}
                    <div class="user-row-info">
                        <p class="user-row-name">${User.escape(this.fullName)}</p>
                        <p class="user-row-username">@${User.escape(this.userName)}</p>
                    </div>
                </a>
                ${button}
            </div>
        `;
    }

    getAuthorPresentation(isFollowing, showFollowButton = true) {
        return `
            <div class="author-row">
                <a class="btn-user user-link" href="${this.getProfileHref()}">
                    ${this.getAvatarPresentation("user-avatar")}
                    <p class="p-index">${User.escape(this.fullName)}</p>
                </a>
                ${showFollowButton ? this.getFollowButtonPresentation(isFollowing) : ""}
            </div>
        `;
    }

    getCommentPresentation(text, isFollowing, showButton = true) {
        const button = showButton ? this.getFollowButtonPresentation(isFollowing, "btn-follow-sm") : "";

        return `
            <div class="User-comment" data-user-id="${this.id}">
                <div class="user-comment-header">
                    ${this.getAvatarPresentation("user-avatar comment-avatar")}
                    <a class="comment-username comment-author-link" href="${this.getProfileHref()}">${User.escape(this.fullName)}</a>
                    <span class="comment-follow">${button}</span>
                </div>
                <p class="comment-text">${User.escape(text)}</p>
            </div>
        `;
    }
}