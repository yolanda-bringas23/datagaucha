/* Copyright (c) 2026 David-irusta
   This code is licensed under the MIT License (see LICENSE file for details) */

class Ban {
    constructor(element) {
        const { id, userId, userName, reason, bannedAt, expiresAt } = element ?? {};
        this.id = id;
        this.userId = userId;
        this.userName = userName ?? "";
        this.reason = reason ?? "";
        this.bannedAt = bannedAt;
        this.expiresAt = expiresAt ?? null;
    }

    getBanPresentation() {
        const nombre = Ban.escape(this.userName);
        const motivo = Ban.escape(this.reason);
        return `
            <article class="publication-card" data-ban-id="${this.id}">
                <header class="card-header">
                    <span class="user-name">@${nombre}</span>
                </header>
                <p class="p-index">Motivo: ${motivo}</p>
                <p class="p-index">Desde: ${this.bannedAt ?? "—"}</p>
                <p class="p-index">Hasta: ${this.expiresAt ?? "permanente"}</p>
            </article>
        `;
    }

    static escape(t) { return User.escape(t); }
}