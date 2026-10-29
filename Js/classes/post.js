class Post{
    constructor(element){
        this.title = element.title,
        this.body = element.body,
        this.image = element.imageUrl,
        this.userName = element.userName
    }
    /* Atributos, constructor, etc */ 
    getPostPresentation() {
        return `
            <article class="publication-card">
                <header class="card-header">
                    <a href="html/perfil.html" class="btn-user">
                        <i class="fa-solid fa-circle-user user-btn"></i>
                        <span class="user-name">${this.userName}</span>
                    </a>
                    <button class="btn-more-options" type="button" aria-label="Más opciones">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </header>
                <h2>${this.title}</h2>
                <p class="p-index">${this.body}</p>
               ${renderImage(this.image)}
                <div class="btn-group-actions">
                    <button type="button"><i class="fa-solid fa-heart btn-like"></i></button>
                    <a href="html/comentarios.html" class="btn-sef" aria-label="Ver comentarios">
                        <i class="fa-solid fa-comment btn-comment"></i>
                    </a>
                    <button type="button"><i class="fa-solid fa-face-sad-tear"></i></button>
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