function IrTelaCadastro() {
    window.location.href = "cadastro.html";
}

function IrTelaLogin() {
    window.alert("Tela de Login ainda Não Implementada");
}

document.addEventListener("DOMContentLoaded", () => {
    const cadastro = document.querySelector("#CriarConta");
    cadastro.addEventListener("click", (e) => {
        IrTelaCadastro();
    })

    const login = document.querySelector("#Login");
    login.addEventListener("click", (e) => {
        IrTelaLogin();
    })
})