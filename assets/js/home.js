// Variável global para armazenar a postagem selecionada para denúncia
let postagemSelecionada = null;

// Puxa o Usuario Logado do localStorage para poder usar suas infmações, como o ID para criar denúncias e o nível para mostrar o painel do admin
const usuario = JSON.parse(
    localStorage.getItem("usuarioLogado")
);

document.addEventListener("DOMContentLoaded", () => {

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
            const relatoCard = botao.closest(".relato-card");
            postagemSelecionada = Number(relatoCard.dataset.id);
            abrirModalDenuncia();
        });
    });

    // Enviar denúncia
    const enviarDenunciaBtn = document.querySelector(".report-modal__button");
    enviarDenunciaBtn.addEventListener("click", () => {
        criarDenuncia();
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


// Função para criar denúncia
function criarDenuncia() {

    // pega textarea do modal

    const textarea = document.querySelector(".report-modal__textarea");

    // pega motivo digitado
    const motivo = textarea.value;

    // valida campo vazio
    if (!motivo.trim()) {
        window.alert("Digite o motivo da denúncia");
        return;
    }

    // pega denúncias existentes
    const denuncias = JSON.parse(
        localStorage.getItem("denuncias")
    ) || [];

    // gera ID automático
    const ultimoId =
        denuncias.length > 0
            ? denuncias[denuncias.length - 1].id
            : 0;

    // cria denúncia
    const novaDenuncia = {
        id: ultimoId + 1,
        postagemId: postagemSelecionada,
        usuarioId: usuario.id,
        descricao: motivo,
        dataCriacao: new Date().toISOString(),
        status: "pendente"
    };

    // adiciona no array
    denuncias.push(novaDenuncia);

    // salva no localStorage
    localStorage.setItem(
        "denuncias",
        JSON.stringify(denuncias)
    );

    // limpa textarea
    textarea.value = "";

    fecharModalDenuncia();

    window.alert("Denúncia criada");

}