class Post{
    constructor(element){
        this.title = element.title,
        this.body = element.body,
        this.image = element.imageUrl
        this.userName = element.userName
    }
    /* Atributos, constructor, etc */ 
    getPostPresentation() {
        return `
            <article class="publication-card">
                <button class="btn-user" type="button">
                    <i class="fa-solid fa-circle-user user-btn"></i>
                    <p class="p-index">${this.userName}</p>
                </button>
                <h2>${this.title}</h2>
                <p class="p-index">${this.body}</p>
                <img class="image-publication" src="${this.image}" alt="Publicación de usuario: foto del día en familia">
                <div class="btn-group-actions">
                    <button type="button"><i class="fa-solid fa-heart btn-like"></i></button>
                    <a href="html/comentarios.html"><button type="button"><i class="fa-solid fa-comment btn-comment"></i></button></a>
                    <button type="button"><i class="fa-solid fa-face-sad-tear"></i></button>
                </div>
            </article>
        `
    }
}