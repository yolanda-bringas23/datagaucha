const commentsList = document.getElementById("comment-write")
const txtComment =  document.getElementById("txt-comment")

commentsList.addEventListener("submit", (eventInformation) =>{
    eventInformation.preventDefault();

    const data = {
        comentario : txtComment.value,
        idUser : 1
    }
    alert(JSON.stringify(data))
})