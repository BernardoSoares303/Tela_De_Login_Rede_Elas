document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (usuario?.nivel == "admin") {
        document.getElementById("Painel__adm").style.display = "block";
    }

    const logoutBtn = document.getElementById("Logout");
    logoutBtn.addEventListener("click", (e) => {
        logout();
    })

    const denunciarBtn = document.querySelector(".relato-card__report");
    denunciarBtn.addEventListener("click", (e) => {
        abrirModalDenuncia();
    })

    const fecharDenunciaBtn = document.querySelector(".report-modal__close");
    fecharDenunciaBtn.addEventListener("click", (e) => {
        fecharModalDenuncia();
    })
});

function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
}

function abrirModalDenuncia() {
    const modal = document.getElementById("reportModal");
    modal.style.display = "flex";
}

function fecharModalDenuncia() {
    const modal = document.getElementById("reportModal");
    modal.style.display = "none";
}