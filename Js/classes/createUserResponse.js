class createUserResponse{
    constructor(payload){
        this.id = payload.id
        this.name = payload.name
        this.avatarUrl = payload.avatarUrl
        this.userName = payload.userName
    }
}