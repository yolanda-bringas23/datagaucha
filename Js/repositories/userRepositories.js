const USERS_STORAGE_KEY = "datagaucha-usuarios";
const SESSION_STORAGE_KEY = "datagaucha-sesion";

const CURRENT_USER_ID = 1;

const personasSemilla = [
    { id: 1, userName: "Papadopoulus", fullName: "Federico Papadopoulus", email: "fede@datagaucha.com", bio: "Desarrollador en formación. Mate, código y domingos de fútbol.", following: [2, 3, 6] },
    { id: 2, userName: "martinagomez", fullName: "Martina Gómez", email: "martina@datagaucha.com", bio: "Frontend y diseño de interfaces.", following: [1, 4] },
    { id: 3, userName: "lucasfernandez", fullName: "Lucas Fernández", email: "lucas@datagaucha.com", bio: "Backend. Bases de datos y APIs.", following: [1] },
    { id: 4, userName: "sofiara", fullName: "Sofía Ramírez", email: "sofia@datagaucha.com", bio: "UX/UI. Me gusta que todo se entienda solo.", following: [2] },
    { id: 5, userName: "agustintorres", fullName: "Agustín Torres", email: "agustin@datagaucha.com", bio: "QA y testing. Si se puede romper, lo rompo.", following: [] },
    { id: 6, userName: "valentinadiaz", fullName: "Valentina Díaz", email: "valentina@datagaucha.com", bio: "Full stack en progreso.", following: [1, 9] },
    { id: 7, userName: "brunoacosta", fullName: "Bruno Acosta", email: "bruno@datagaucha.com", bio: "Apasionado por JavaScript.", following: [1] },
    { id: 8, userName: "camilaherrera", fullName: "Camila Herrera", email: "camila@datagaucha.com", bio: "Diseño y accesibilidad web.", following: [2] },
    { id: 9, userName: "nicolasmolina", fullName: "Nicolás Molina", email: "nicolas@datagaucha.com", bio: "Estudiante de desarrollo de software.", following: [] },
    { id: 10, userName: "julietarojas", fullName: "Julieta Rojas", email: "julieta@datagaucha.com", bio: "Comunicación y redes.", following: [1] },
    { id: 11, userName: "francoibanez", fullName: "Franco Ibáñez", email: "franco@datagaucha.com", bio: "Soporte técnico y redes.", following: [4, 5] }
];

function crearSemilla() {
    const usuarios = personasSemilla.map(persona => ({
        ...persona,
        avatar: "../img/avatar.jpg",
        followers: [],
        previousUserNames: []
    }));

    for (const persona of usuarios) {
        for (const idSeguido of persona.following) {
            const seguido = usuarios.find(usuario => usuario.id === idSeguido);
            if (seguido && !seguido.followers.includes(persona.id)) {
                seguido.followers.push(persona.id);
            }
        }
    }

    return usuarios;
}

function getUsers() {
    const guardado = localStorage.getItem(USERS_STORAGE_KEY);

    if (!guardado) {
        const semilla = crearSemilla();
        saveUsers(semilla);
        return semilla;
    }

    return JSON.parse(guardado);
}

function getUserById(id) {
    return getUsers().find(usuario => usuario.id === id) || null;
}

function getUserByUserName(userName) {
    if (!userName) return null;
    const buscado = String(userName).replace(/^@/, "").toLowerCase();

    return getUsers().find(usuario => usuario.userName.toLowerCase() === buscado) || null;
}

function getCurrentUserId() {
    const guardado = localStorage.getItem(SESSION_STORAGE_KEY);
    return guardado ? parseInt(guardado) : CURRENT_USER_ID;
}

function getCurrentUser() {
    return getUserById(getCurrentUserId()) || getUsers()[0];
}

function getFollowers(usuario) {
    return usuario.followers
        .map(id => getUserById(id))
        .filter(seguidor => seguidor !== null);
}

function getFollowing(usuario) {
    return usuario.following
        .map(id => getUserById(id))
        .filter(seguido => seguido !== null);
}

function getCommunityUsers() {
    const yo = getCurrentUser();
    return getUsers().filter(usuario => usuario.id !== yo.id);
}

function searchUsers(texto) {
    const consulta = String(texto || "").trim().toLowerCase();
    const yo = getCurrentUser();

    const otros = getUsers().filter(usuario => usuario.id !== yo.id);

    if (consulta === "") return otros;

    return otros.filter(usuario =>
        usuario.fullName.toLowerCase().includes(consulta) ||
        usuario.userName.toLowerCase().includes(consulta)
    );
}

function getUserAliases(usuario) {
    return [usuario.userName, ...(usuario.previousUserNames || [])];
}

function saveUsers(usuarios) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuarios));
}

function updateUser(datosNuevos) {
    const usuarios = getUsers();

    const actualizados = usuarios.map(usuario => {
        if (usuario.id !== datosNuevos.id) return usuario;

        const { id, ...cambios } = datosNuevos;
        const usuarioActualizado = { ...usuario, ...cambios };

        if (cambios.userName && cambios.userName !== usuario.userName) {
            usuarioActualizado.previousUserNames = [
                usuario.userName,
                ...(usuario.previousUserNames || [])
            ];
        }

        return usuarioActualizado;
    });

    saveUsers(actualizados);
    return actualizados.find(usuario => usuario.id === datosNuevos.id);
}

function toggleFollow(targetId) {
    const usuarios = getUsers();
    const yoId = getCurrentUserId();

    const yo = usuarios.find(usuario => usuario.id === yoId);
    const objetivo = usuarios.find(usuario => usuario.id === targetId);

    if (!yo || !objetivo || yo.id === objetivo.id) return null;

    const loSigo = yo.following.includes(targetId);

    if (loSigo) {
        yo.following = yo.following.filter(id => id !== targetId);
        objetivo.followers = objetivo.followers.filter(id => id !== yoId);
    } else {
        yo.following = [...yo.following, targetId];
        if (!objetivo.followers.includes(yoId)) {
            objetivo.followers = [...objetivo.followers, yoId];
        }
    }

    saveUsers(usuarios);

    return { isFollowing: !loSigo, target: objetivo };
}

function removeFollower(followerId) {
    const usuarios = getUsers();
    const yoId = getCurrentUserId();

    const yo = usuarios.find(usuario => usuario.id === yoId);
    const seguidor = usuarios.find(usuario => usuario.id === followerId);

    if (!yo || !seguidor) return null;

    yo.followers = yo.followers.filter(id => id !== followerId);
    seguidor.following = seguidor.following.filter(id => id !== yoId);

    saveUsers(usuarios);
    return seguidor;
}

function isFollowing(targetId) {
    return getCurrentUser().following.includes(targetId);
}

function resetUsers() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
}
