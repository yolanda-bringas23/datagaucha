/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

class Post {
    constructor(element) {
        const { id, title, content, body, userName, urlImage, imageUrl, myReaction } = element;
        this.id = id;
        this.title = title ?? "";
        this.body = content ?? body ?? "";
        this.image = urlImage ?? imageUrl ?? "";
        this.userName = userName ?? "";
        this.myReaction = myReaction ?? null;
    }

    static escape(t) { return User.escape(t); }

    static renderImage(url) {
        return url
            ? `<img class="image-publication" src="${Post.escape(url)}" alt="Post image">`
            : "";
    }

    getPostPresentation() {
        const likeActive = this.myReaction === "Like" ? "reaction-active" : "";
        const dislikeActive = this.myReaction === "Dislike" ? "reaction-active" : "";

        return `
            <article class="publication-card" data-post-id="${this.id}">
                <header class="card-header">
                    <a href="html/perfil.html?usuario=${encodeURIComponent(this.userName)}" class="btn-user">
                        <i class="fa-solid fa-circle-user user-btn"></i>
                        <span class="user-name">${Post.escape(this.userName)}</span>
                    </a>
                    <button class="btn-more-options" type="button" aria-label="More options">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </header>
                <h2>${Post.escape(this.title)}</h2>
                <p class="p-index">${Post.escape(this.body)}</p>
                ${Post.renderImage(this.image)}
                <div class="btn-group-actions">
                    <button type="button" class="${likeActive}"
                            data-action="reaction" data-post-id="${this.id}" data-type="Like">
                        <i class="fa-solid fa-heart btn-like"></i>
                    </button>
                    <a href="html/comentarios.html" class="btn-sef" aria-label="View comments">
                        <i class="fa-solid fa-comment btn-comment"></i>
                    </a>
                    <button type="button" class="${dislikeActive}"
                            data-action="reaction" data-post-id="${this.id}" data-type="Dislike">
                        <i class="fa-solid fa-face-sad-tear"></i>
                    </button>
                </div>
            </article>`;
    }
}