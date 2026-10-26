class Toast {
    constructor(idElemento) {
        this.elemento = document.getElementById(idElemento);
        this.temporizador = null;
    }

    mostrar(texto, tipo = "ok") {
        if (!this.elemento) return;

        this.elemento.innerText = texto;
        this.elemento.className = `profile-toast is-visible${tipo === "error" ? " is-error" : ""}`;

        clearTimeout(this.temporizador);
        this.temporizador = setTimeout(() => this.ocultar(), 2600);
    }

    ocultar() {
        if (!this.elemento) return;
        this.elemento.className = "profile-toast";
    }
}
