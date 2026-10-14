const commentForm = document.getElementById("comment-write")
const txtComment =  document.getElementById("txt-comment")
const commentsList = document.getElementById("comments-list")

commentForm.addEventListener("submit", (eventInformation) =>{
    eventInformation.preventDefault();

    if (txtComment.value == "") {
        alert("escribe un comentario antes de publicar!")
        return
    }

    const comment = document.createElement("div")
    comment.className = "User-comment"

    const commentHeader = document.createElement("div")
    commentHeader.className = "user-comment-header"

    const userIcon = document.createElement("i")
    userIcon.className = "fa-solid fa-circle-user comment-icon"

    const userName = document.createElement("p")
    userName.className = "comment-username"
    userName.innerText = "Nombre de usuario"

    const commentText = document.createElement("p")
    commentText.className = "comment-text"
    commentText.innerText = txtComment.value

    commentHeader.append(userIcon)
    commentHeader.append(userName)
    comment.append(commentHeader)
    comment.append(commentText)
    commentsList.append(comment)

    txtComment.value = ""
    txtComment.focus()
})
