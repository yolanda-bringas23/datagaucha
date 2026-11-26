/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

class Post {
    constructor(element) {
        const { id, title, content, body, userName, urlImage, imageUrl, myReaction, likeCount, dislikeCount } = element;
        this.id = id;
        this.title = title ?? "";
        this.body = content ?? body ?? "";
        this.image = urlImage ?? imageUrl ?? "";
        this.userName = userName ?? "";
        this.myReaction = myReaction ?? null;
        this.likeCount = likeCount ?? 0;
        this.dislikeCount = dislikeCount ?? 0;
    }

    static escape(t) { return User.escape(t); }

    static renderImage(url) {
        if (!url) return "";

        const fullUrl = url.startsWith("http")
            ? url
            : `${BACKEND_HOST}${url.replace(/^\/+/, "")}`;

        return `<img class="image-publication" src="${Post.escape(fullUrl)}" alt="Post image" loading="lazy" decoding="async">`;
    }

    getPostPresentation() {
        const likeActive = this.myReaction === "Like" ? "reaction-active" : "";
        const dislikeActive = this.myReaction === "Dislike" ? "reaction-active" : "";
        const userName = Post.escape(this.userName);

        return `
            <article class="publication-card" data-post-id="${this.id}">
                <header class="card-header">
                    <a href="html/perfil.html?usuario=${encodeURIComponent(this.userName)}" class="btn-user">
                        <i class="fa-solid fa-circle-user user-btn"></i>
                        <span class="user-name">${userName}</span>
                    </a>
                    <div class="dropdown post-options">
                        <button class="btn-more-options" type="button"
                                data-dropdown-toggle="true" aria-expanded="false"
                                aria-label="Más opciones">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <button class="dropdown-item" type="button"
                                        data-action="ban"
                                        data-user-name="${userName}">Ban user</button>
                            </li>
                        </ul>
                    </div>
                </header>
                
                <h2>${Post.escape(this.title)}</h2>
                <p class="p-index">${Post.escape(this.body)}</p>
                ${Post.renderImage(this.image)}
                
                <div class="btn-group-actions">
                    <button type="button" class="${likeActive}"
                            data-action="reaction" data-post-id="${this.id}" data-type="Like">
                        <i class="fa-solid fa-heart btn-like"></i> ${this.likeCount}
                    </button>
                    
                    <button type="button" class="${dislikeActive}"
                            data-action="reaction" data-post-id="${this.id}" data-type="Dislike">
                        <i class="fa-solid fa-face-sad-tear"></i> ${this.dislikeCount}
                    </button>
                </div>
            </article>`;
    }
}