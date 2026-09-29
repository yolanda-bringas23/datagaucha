class Comments{
    constructor(element){
        this.title = element.title,
        this.body = element.body,
        this.image = element.imageUrl,
        this.userName = element.userName,
        this.comment = element.comment
    }
    /* Atributos, constructor, etc */ 
    getCommentsPresentation() {
        return `
            <article class="publication-card">

                <button class="btn-user" type="button">
                    <i class="fa-solid fa-circle-user user-btn"></i>
                    <p class="p-index">${this.userName}</p>
                </button>

                <h1>${this.title}</h1>

                <p class="p-index">${this.body}</p>

                ${renderImage(this.image)}

                <div class="btn-group-actions">
                    <button type="button"><i class="fa-solid fa-heart btn-like"></i></button>
                    <button type="button"><i class="fa-solid fa-face-sad-tear"></i></button>
                    <button type="button"><i class="fa-solid fa-comment btn-comment"></i></button>
                </div>

                <form class="comment-write" id="comment-write" action="" method="post">
                    <textarea name="comment" id="txt-comment" placeholder="Escribe un comentario..."></textarea>
                    <button class="btn btn-primary btn-crear" type="submit">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </form>

                <div class="comments-list">
                    <div class="User-comment">
                        <div class="user-comment-header">
                            <i class="fa-solid fa-circle-user comment-icon"></i>
                            <p class="comment-username">${this.userName}</p>
                        </div>
                        <p class="comment-text">${this.comment}</p>
                    </div>
                    <div class="User-comment">
                        <div class="user-comment-header">
                            <i class="fa-solid fa-circle-user comment-icon"></i>
                            <p class="comment-username">${this.userName}</p>
                        </div>
                        <p class="comment-text">${this.comment}</p>
                    </div>
                    <div class="User-comment">
                        <div class="user-comment-header">
                            <i class="fa-solid fa-circle-user comment-icon"></i>
                            <p class="comment-username">${this.userName}</p>
                        </div>
                        <p class="comment-text">${this.comment}</p>
                    </div>
                    <div class="User-comment">
                        <div class="user-comment-header">
                            <i class="fa-solid fa-circle-user comment-icon"></i>
                            <p class="comment-username">${this.userName}</p>
                        </div>
                        <p class="comment-text">${this.comment}</p>
                    </div>
                    <div class="User-comment">
                        <div class="user-comment-header">
                            <i class="fa-solid fa-circle-user comment-icon"></i>
                            <p class="comment-username">${this.userName}</p>
                        </div>
                        <p class="comment-text">${this.comment}</p>
                    </div>
                </div>

            </article>
        `
    }
}

function renderImage(img){
    if(img == null || img == 'undefined' || img == ""){
        return "";
    } 
    else{
        return `<img class="image-publication" src="${img}" alt="Publicación de usuario: foto del día en familia"></img> `
    }
}