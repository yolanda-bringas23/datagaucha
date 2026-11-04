const PAGE_SIZE = 12;

class ListaPaginada {
    constructor({ contenedor, cargarPagina, armarFila, vacio, alCargar, zonaScroll }) {
        this.contenedor = contenedor;
        this.cargarPagina = cargarPagina;
        this.armarFila = armarFila;
        this.vacio = vacio;
        this.alCargar = alCargar;
        this.zonaScroll = zonaScroll || contenedor;

        this.zonaScroll.addEventListener("scroll", () => this.siHaceFalta());
    }

    reiniciar() {
        this.pagina = 0;
        this.total = 0;
        this.termino = false;
        this.cargando = false;
        this.contenedor.innerHTML = "";
        this.cargarSiguiente();
    }

    cargarSiguiente() {
        if (this.cargando || this.termino) return;
        this.cargando = true;

        this.cargarPagina(this.pagina + 1, (items) => {
            this.pagina++;
            this.total += items.length;
            this.cargando = false;
            this.termino = items.length < PAGE_SIZE;

            if (this.total === 0) {
                this.contenedor.innerHTML = `<p class="profile-empty">${this.vacio}</p>`;
            } else {
                this.contenedor.insertAdjacentHTML("beforeend", items.map(this.armarFila).join(""));
            }

            if (this.alCargar) this.alCargar(this.total, this.termino);
            this.siHaceFalta();
        });
    }

    siHaceFalta() {
        const zona = this.zonaScroll === window ? document.documentElement : this.zonaScroll;
        if (zona.clientHeight === 0) return; 

        const alFinal = zona.scrollTop + zona.clientHeight >= zona.scrollHeight - 50;
        if (alFinal) this.cargarSiguiente();
    }
}
