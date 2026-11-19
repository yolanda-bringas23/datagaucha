
/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

const registerForm = document.getElementById("register-form");
const txtName = document.getElementById("NameInput");
const txtUser = document.getElementById("nameUser-register");
const txtPassword = document.getElementById("password-register");
const txtPasswordAgain = document.getElementById("Password-again");
const txtEmail = document.getElementById("Email-register");
const txtDay = document.getElementById("day-register");
const txtMonth = document.getElementById("month-register");
const txtYear = document.getElementById("year-register");
const termsCheck = document.getElementById("terms-check");
const ageCheck = document.getElementById("age-check");
const txtFile = document.getElementById("avatar-register");

registerForm.addEventListener("submit", (eventInformation) => {
    eventInformation.preventDefault();

    const data = {
        name: txtName.value,
        userName: txtUser.value,
        password: txtPassword.value,
        email: txtEmail.value,
        day: txtDay.value,
        month: txtMonth.value,
        year: txtYear.value
    };

    const nameComplete = data.name.trim();

    const nameCompleteFormat = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+)+$/;

    if (nameComplete === "") {
        show(
            "Nombre inválido",
            "Ingresa tu nombre completo",
            "error"
        );
        return;
    }

    if (!nameCompleteFormat.test(nameComplete)) {
        show(
            "Nombre incorrecto",
            "Tu nombre completo no debe contener caracteres especiales",
            "error"
        );
        return;
    }

    if (data.userName.trim() === "") {
        show(
            "Nombre de usuario incorrecto",
            "Ingresa tu nombre de usuario",
            "error"
        );
        return;
    }

    if (data.password === "") {
        show(
            "Contraseña incorrecta",
            "Debes introducir una contraseña válida",
            "error"
        );
        return;
    }

    if (txtPasswordAgain.value === "") {
        show(
            "Contraseña incorrecta",
            "Debes ingresar nuevamente tu contraseña",
            "error"
        );
        return;
    }

    if (data.password !== txtPasswordAgain.value) {
        show(
            "Contraseña incorrecta",
            "Las contraseñas no coinciden",
            "error"
        );
        return;
    }

    if (data.email.trim() === "") {
        show(
            "Email inválido",
            "Ingresá nuevamente tu email",
            "error"
        );
        return;
    }

    if (data.day === "" || data.month === "" || data.year === "") {
        show(
            "Fecha de nacimiento inválida",
            "Debes ingresar tu fecha de nacimiento",
            "error"
        );
        return;
    }

    // Validación de fecha de nacimiento
    const day = Number(txtDay.value);
    const month = Number(txtMonth.value);
    const year = Number(txtYear.value);

    const daysInMonth = new Date(year, month, 0).getDate();

    const validDate =
        Number.isInteger(day) &&
        Number.isInteger(month) &&
        Number.isInteger(year) &&
        year >= 1900 &&
        month >= 1 &&
        month <= 12 &&
        day >= 1 &&
        day <= daysInMonth;

    if (!validDate) {
        show(
            "Fecha inválida",
            "Ingresa una fecha de nacimiento válida",
            "error"
        );
        return;
    }

    // Construir fecha para el backend
    const dateBirth = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (termsCheck.checked === false) {
        show(
            "¡Aviso!",
            "Acepta los términos y condiciones",
            "warning"
        );
        return;
    }

    if (ageCheck.checked === false) {
        show(
            "¡Aviso!",
            "Confirma que eres mayor de 18 años",
            "warning"
        );
        return;
    }

    // Preparar solicitud
    const request = {
        name: txtName.value.trim(),
        userName: txtUser.value.trim(),
        password: txtPassword.value,
        dateBirth: dateBirth,
        file: txtFile.files[0] ?? null
    };

    // Enviar registro al backend
    register(request, (response) => {
        show(
            "¡Registro exitoso!",
            "Tu cuenta fue creada correctamente",
            "success"
        );

        console.log("Usuario registrado:", response);
        
        setTimeout(() => {
            window.location.href = "loguear.html"
        }, 2000)
    });
});
