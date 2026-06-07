document.addEventListener("DOMContentLoaded", () => {
    
    const usuario = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    // Carregamento do Botão de Painel do Admin
    if (usuario?.nivel == "admin") {
        document.getElementById("Painel__adm").style.display = "block";
    }

    // LOGOUT
    const logoutBtn = document.getElementById("Logout");
    logoutBtn.addEventListener("click", () => {
        logout();
    });

    // Abrir modal de denúncia
    const denunciarBtns = document.querySelectorAll(".relato-card__report");
    denunciarBtns.forEach((botao) => {
        botao.addEventListener("click", () => {
            abrirModalDenuncia();
        });
    });

    // FECHAR MODAL
    const fecharDenunciaBtn = document.querySelector(".report-modal__close");
    fecharDenunciaBtn.addEventListener("click", () => {
        fecharModalDenuncia();
    });
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